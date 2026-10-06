import { ListingSchema, ListingsSchema, type Listing } from '../../models/listing.ts';

async function request(url: string, method: string, body?: unknown): Promise<unknown> {
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (response.status === 204) return undefined;
    const data: unknown = await response.json();
    if (!response.ok) {
        const message = data && typeof data === 'object' && 'error' in data ? String(data.error) : 'Listing request failed.';
        throw new Error(message);
    }
    return data;
}

export const listingClient = (api: string) => ({
    async list(): Promise<Listing[]> { return ListingsSchema.parse(await request(api, 'GET')); },
    async save(id: string | null, name: string): Promise<Listing> {
        return ListingSchema.parse(await request(id ? `${api}/${id}` : api, id ? 'PUT' : 'POST', { name }));
    },
    async delete(id: string): Promise<void> { await request(`${api}/${id}`, 'DELETE'); },
});
