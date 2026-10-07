import { z } from 'zod';
import { requestListing } from '../lib/listingRequest.ts';

const SignatureSchema = z.object({
    cloudName: z.string().min(1),
    apiKey: z.string().min(1),
    timestamp: z.number().int().positive(),
    folder: z.string().min(1),
    signature: z.string().min(1),
}).strict();

const UploadSchema = z.object({
    secure_url: z.url(),
    public_id: z.string().min(1),
}).passthrough();

export type ProductImageUpload = {
    url: string;
    publicId: string;
};

export class ProductImage {
    private readonly signatureUrl: string;

    constructor(host = import.meta.env?.VITE_LISTINGRECORD_URL || 'http://127.0.0.1:4180') {
        this.signatureUrl = `${host.replace(/\/+$/, '')}/listingrecord/product-images/signature`;
    }

    async upload(file: File): Promise<ProductImageUpload> {
        this.validate(file);
        const signature = SignatureSchema.parse(await requestListing(this.signatureUrl, {method: 'POST'}));
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/image/upload`,
            {method: 'POST', body: this.formData(file, signature)},
        );

        let body: unknown;
        try {
            body = await response.json();
        } catch {
            throw new Error('Cloudinary returned an invalid response.');
        }

        if (!response.ok) throw new Error('Unable to upload the product image.');

        const uploaded = UploadSchema.safeParse(body);
        if (!uploaded.success) throw new Error('Cloudinary returned an invalid image record.');

        return {
            url: uploaded.data.secure_url,
            publicId: uploaded.data.public_id,
        };
    }

    private validate(file: File): void {
        if (!file.type.startsWith('image/')) throw new Error('Choose an image file.');
        if (file.size > 10 * 1024 * 1024) throw new Error('Choose an image smaller than 10 MB.');
    }

    private formData(file: File, signature: z.infer<typeof SignatureSchema>): FormData {
        const form = new FormData();
        form.append('file', file);
        form.append('api_key', signature.apiKey);
        form.append('timestamp', String(signature.timestamp));
        form.append('folder', signature.folder);
        form.append('signature', signature.signature);
        return form;
    }
}
