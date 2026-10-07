import { z } from 'zod';
import { requestListing } from '../lib/listingRequest.ts';

export const SellerIdSchema = z.string().trim().min(1).max(128);
export const ListingStatusSchema = z.enum(['active', 'disable', 'inreview']);

export type ListingStatus = z.infer<typeof ListingStatusSchema>;

export const ListingUpdateSchema = z.object({
    name: z.string().trim().min(1).max(50),
    status: ListingStatusSchema.default('active'),
}).strict();

export const ListingCreateSchema = ListingUpdateSchema.extend({
    sellerId: SellerIdSchema,
}).strict();

const RecordSchema = ListingUpdateSchema.extend({
    id: z.uuid(),
    sellerId: SellerIdSchema.optional(),
});

export type ListingUpdateInput = z.infer<typeof ListingUpdateSchema>;
export type ListingCreateInput = z.infer<typeof ListingCreateSchema>;
export type ListingRecord = z.infer<typeof RecordSchema>;

export class Listing {
    private readonly url: string;

    constructor(host = import.meta.env?.VITE_LISTINGRECORD_URL || 'http://127.0.0.1:4180') {
        this.url = `${host.replace(/\/+$/, '')}/listingrecord/listings`;
    }

    async list(): Promise<ListingRecord[]> {
        const records = z.array(RecordSchema).safeParse(await requestListing(this.url, { cache: 'no-store' }));
        if (!records.success) throw new Error('The listing service returned invalid records.');
        return records.data;
    }

    create(input: ListingCreateInput): Promise<ListingRecord> {
        return this.save(this.url, 'POST', ListingCreateSchema.parse(input));
    }

    update(id: string, input: ListingUpdateInput): Promise<ListingRecord> {
        return this.save(this.recordUrl(id), 'PUT', ListingUpdateSchema.parse(input));
    }

    async delete(id: string): Promise<void> {
        await requestListing(this.recordUrl(id), { method: 'DELETE' });
    }

    private recordUrl(id: string): string {
        return `${this.url}/${z.uuid().parse(id)}`;
    }

    private async save(url: string, method: 'POST' | 'PUT', input: ListingCreateInput | ListingUpdateInput): Promise<ListingRecord> {
        const record = RecordSchema.safeParse(await requestListing(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        }));
        if (!record.success) throw new Error('The listing service returned an invalid record.');
        return record.data;
    }
}
