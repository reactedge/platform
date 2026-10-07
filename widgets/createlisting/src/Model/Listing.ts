import { z } from 'zod';
import { requestListing } from '../lib/listingRequest.ts';

export const ListingStatusSchema = z.enum(['active', 'disable', 'inreview']);
export type ListingStatus = z.infer<typeof ListingStatusSchema>;

export const ListingInputSchema = z.object({
    name: z.string().trim().min(1).max(50),
    status: ListingStatusSchema.default('active'),
}).strict();

const RecordSchema = ListingInputSchema.extend({ id: z.uuid() });
export type ListingInput = z.infer<typeof ListingInputSchema>;
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

    create(input: ListingInput): Promise<ListingRecord> {
        return this.save(this.url, 'POST', input);
    }

    update(id: string, input: ListingInput): Promise<ListingRecord> {
        return this.save(this.recordUrl(id), 'PUT', input);
    }

    async delete(id: string): Promise<void> {
        await requestListing(this.recordUrl(id), { method: 'DELETE' });
    }

    private recordUrl(id: string): string {
        return `${this.url}/${z.uuid().parse(id)}`;
    }

    private async save(url: string, method: 'POST' | 'PUT', input: ListingInput): Promise<ListingRecord> {
        const data = ListingInputSchema.parse(input);
        const record = RecordSchema.safeParse(await requestListing(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }));
        if (!record.success) throw new Error('The listing service returned an invalid record.');
        return record.data;
    }
}
