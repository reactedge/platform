import { z } from 'zod';
import { requestListing } from '../lib/listingRequest.ts';

export const ProductInputSchema = z.object({
    listingId: z.uuid(),
    sku: z.string().trim().min(1).max(100),
    title: z.string().trim().min(1).max(150),
    description: z.string().trim().min(1).max(5000),
    price: z.number().finite().nonnegative(),
    image: z.url(),
}).strict();

const ProductRecordSchema = ProductInputSchema.extend({ id: z.uuid() });
export type ProductInput = z.infer<typeof ProductInputSchema>;
export type ProductRecord = z.infer<typeof ProductRecordSchema>;

export class Product {
    private readonly url: string;

    constructor(host = import.meta.env?.VITE_LISTINGRECORD_URL || 'http://127.0.0.1:4180') {
        this.url = `${host.replace(/\/+$/, '')}/listingrecord/products`;
    }

    async create(input: ProductInput): Promise<ProductRecord> {
        const data = ProductInputSchema.parse(input);
        const record = ProductRecordSchema.safeParse(await requestListing(this.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }));
        if (!record.success) throw new Error('The listing service returned an invalid product.');
        return record.data;
    }
}
