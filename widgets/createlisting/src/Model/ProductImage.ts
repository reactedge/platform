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

type Signature = z.infer<typeof SignatureSchema>;

export class ProductImage {
    private readonly signatureUrl: string;

    constructor(host = import.meta.env?.VITE_LISTINGRECORD_URL || 'http://127.0.0.1:4180') {
        this.signatureUrl = `${host.replace(/\/+$/, '')}/listingrecord/product-images/signature`;
    }

    async upload(files: File[]): Promise<ProductImageUpload[]> {
        this.validate(files);
        const signature = SignatureSchema.parse(await requestListing(this.signatureUrl, {method: 'POST'}));
        return Promise.all(files.map(file => this.uploadOne(file, signature)));
    }

    private async uploadOne(file: File, signature: Signature): Promise<ProductImageUpload> {
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

        if (!response.ok) throw new Error('Unable to upload a product image.');

        const uploaded = UploadSchema.safeParse(body);
        if (!uploaded.success) throw new Error('Cloudinary returned an invalid image record.');

        return {
            url: uploaded.data.secure_url,
            publicId: uploaded.data.public_id,
        };
    }

    private validate(files: File[]): void {
        if (files.length === 0) throw new Error('Choose at least one image.');
        if (files.length > 10) throw new Error('Choose no more than 10 images.');
        if (files.some(file => !file.type.startsWith('image/'))) throw new Error('Choose image files only.');
        if (files.some(file => file.size > 10 * 1024 * 1024)) throw new Error('Choose images smaller than 10 MB each.');
    }

    private formData(file: File, signature: Signature): FormData {
        const form = new FormData();
        form.append('file', file);
        form.append('api_key', signature.apiKey);
        form.append('timestamp', String(signature.timestamp));
        form.append('folder', signature.folder);
        form.append('signature', signature.signature);
        return form;
    }
}
