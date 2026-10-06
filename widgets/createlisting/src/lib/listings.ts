import { z } from 'zod';

export const ListingNameSchema = z.string().trim().min(1).max(50);
export const ListingSchema = z.object({ id: z.uuid(), name: ListingNameSchema }).strict();
export const ListingsSchema = z.array(ListingSchema);
export type Listing = z.infer<typeof ListingSchema>;

export async function loadListings(): Promise<Listing[]> {
    const response = await fetch('/listingrecord/listings', { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load listings.');
    return ListingsSchema.parse(await response.json());
}

export async function saveListing(name: string): Promise<Listing> {
    const response = await fetch('/listingrecord/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: ListingNameSchema.parse(name) }),
    });
    if (!response.ok) throw new Error('Unable to save listing.');
    return ListingSchema.parse(await response.json());
}
