import { z } from 'zod';

export const ListingNameSchema = z.string().trim().min(1).max(50);
export const ListingSchema = z.object({ id: z.uuid(), name: ListingNameSchema }).strict();
export const ListingsSchema = z.array(ListingSchema);
export type Listing = z.infer<typeof ListingSchema>;

const hostPrefix = (import.meta.env.VITE_LISTINGRECORD_URL || 'http://127.0.0.1:4180').replace(/\/+$/, '');
const listingsUrl = `${hostPrefix}/listingrecord/listings`;

async function requestListings(options: RequestInit): Promise<unknown> {
    let response: Response;
    try {
        response = await fetch(listingsUrl, options);
    } catch {
        throw new Error('Cannot reach the listing service.');
    }
    if (response.status === 404) throw new Error('The listing service route is unavailable.');
    if ([502, 503, 504].includes(response.status)) throw new Error('The listing service is unavailable.');
    if (response.status >= 500) {
        const jsonResponse = response.headers.get('content-type')?.includes('application/json');
        throw new Error(jsonResponse ? 'The listing service could not read or save its records.' : 'The listing service is unavailable.');
    }
    let body: unknown;
    try { body = await response.json(); }
    catch { throw new Error('The listing service returned an invalid response.'); }
    if (!response.ok) {
        const message = body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
            ? body.error : 'The listing request failed.';
        throw new Error(message);
    }
    return body;
}

export async function loadListings(): Promise<Listing[]> {
    const records = ListingsSchema.safeParse(await requestListings({ cache: 'no-store' }));
    if (!records.success) throw new Error('The listing service returned invalid records.');
    return records.data;
}

export async function saveListing(name: string): Promise<Listing> {
    const record = ListingSchema.safeParse(await requestListings({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: ListingNameSchema.parse(name) }),
    }));
    if (!record.success) throw new Error('The listing service returned an invalid record.');
    return record.data;
}
