import { z } from 'zod';
import { requestListing } from '../lib/listingRequest.ts';

export const ProductImageSchema = z.object({
    url: z.url(),
    publicId: z.string().trim().min(1).max(500),
}).strict();

export const ProductInputSchema = z.object({
    listingId: z.uuid(),
    sku: z.string()
        .trim()
        .min(1)
        .max(15)
        .regex(/^[A-Za-z0-9-]+$/, 'SKU may contain only letters, numbers and hyphens'),
    title: z.string()
        .trim()
        .min(1)
        .max(150)
        .regex(/^[^<>]*$/, 'Title must not contain HTML'),
    description: z.string().trim().min(1).max(5000),
    price: z.number().finite().nonnegative().multipleOf(0.01),
    images: z.array(ProductImageSchema).max(10),
}).strict();

const ProductRecordSchema = ProductInputSchema.extend({ id: z.uuid() });
const ProductRecordsSchema = z.array(ProductRecordSchema);

export type ProductImageRecord = z.infer<typeof ProductImageSchema>;
export type ProductInput = z.infer<typeof ProductInputSchema>;
export type ProductRecord = z.infer<typeof ProductRecordSchema>;

export class Product {
    private readonly url: string;

    constructor(host = import.meta.env?.VITE_LISTINGRECORD_URL || 'http://127.0.0.1:4180') {
        this.url = `${host.replace(/\/+$/, '')}/listingrecord/products`;
    }

    async list(): Promise<ProductRecord[]> {
        const records = ProductRecordsSchema.safeParse(await requestListing(this.url, { cache: 'no-store' }));
        if (!records.success) throw new Error('The listing service returned invalid products.');
        return records.data;
    }

    create(input: ProductInput): Promise<ProductRecord> {
        return this.save(this.url, 'POST', input);
    }

    update(id: string, input: ProductInput): Promise<ProductRecord> {
        return this.save(this.recordUrl(id), 'PUT', input);
    }

    async delete(id: string): Promise<void> {
        await requestListing(this.recordUrl(id), { method: 'DELETE' });
    }

    private recordUrl(id: string): string {
        return `${this.url}/${z.uuid().parse(id)}`;
    }

    private async save(url: string, method: 'POST' | 'PUT', input: ProductInput): Promise<ProductRecord> {
        const data = ProductInputSchema.parse(input);
        const record = ProductRecordSchema.safeParse(await requestListing(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }));
        if (!record.success) throw new Error('The listing service returned an invalid product.');
        return record.data;
    }
}
