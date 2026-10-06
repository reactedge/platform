import { z } from 'zod';
import { requestListing } from '../lib/listingRequest.ts';

const NameSchema = z.string().trim().min(1).max(50);
const RecordSchema = z.object({ id: z.uuid(), name: NameSchema }).strict();
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

    create(name: string): Promise<ListingRecord> {
        return this.save(this.url, 'POST', name);
    }

    update(id: string, name: string): Promise<ListingRecord> {
        return this.save(this.recordUrl(id), 'PUT', name);
    }

    async delete(id: string): Promise<void> {
        await requestListing(this.recordUrl(id), { method: 'DELETE' });
    }

    private recordUrl(id: string): string {
        return `${this.url}/${z.uuid().parse(id)}`;
    }

    private async save(url: string, method: 'POST' | 'PUT', name: string): Promise<ListingRecord> {
        const record = RecordSchema.safeParse(await requestListing(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: NameSchema.parse(name) }),
        }));
        if (!record.success) throw new Error('The listing service returned an invalid record.');
        return record.data;
    }
}
