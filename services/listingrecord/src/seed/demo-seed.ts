import type {Product} from '../model/product/types.ts';

type ListingRecord = {
    id: string;
    name: string;
};

type SeedProduct = Omit<Product, 'id' | 'listingId'>;

type SeedListing = {
    name: string;
    products: SeedProduct[];
};

export const seedListings: SeedListing[] = Array.from({length: 4}, (_, listingIndex) => ({
    name: `Seed Listing ${listingIndex + 1}`,
    products: Array.from({length: 3}, (_, productIndex) => ({
        sku: `SEED-${listingIndex + 1}-${productIndex + 1}`,
        title: `Seed Product ${listingIndex + 1}.${productIndex + 1}`,
        description: `Deterministic seed product ${productIndex + 1} for Seed Listing ${listingIndex + 1}.`,
        price: 100 + (listingIndex * 25) + (productIndex * 10),
        images: [],
    })),
}));

export async function seedDemoData(
    host = process.env.LISTINGRECORD_URL ?? 'http://127.0.0.1:4180',
    fetcher: typeof fetch = fetch,
): Promise<{listingsCreated: number; productsCreated: number}> {
    const baseUrl = `${host.replace(/\/+$/, '')}/listingrecord`;
    const listings = await getJson<ListingRecord[]>(fetcher, `${baseUrl}/listings`);
    const products = await getJson<Product[]>(fetcher, `${baseUrl}/products`);

    let listingsCreated = 0;
    let productsCreated = 0;

    for (const seed of seedListings) {
        const existing = listings.find(listing => listing.name === seed.name);
        const listing = existing ?? await postJson<ListingRecord>(fetcher, `${baseUrl}/listings`, {name: seed.name});

        if (!existing) {
            listings.push(listing);
            listingsCreated += 1;
        }

        for (const product of seed.products) {
            if (products.some(record => record.sku === product.sku)) continue;
            const created = await postJson<Product>(fetcher, `${baseUrl}/products`, {
                ...product,
                listingId: listing.id,
            });
            products.push(created);
            productsCreated += 1;
        }
    }

    return {listingsCreated, productsCreated};
}

async function getJson<T>(fetcher: typeof fetch, url: string): Promise<T> {
    return requestJson<T>(fetcher, url, {method: 'GET'});
}

async function postJson<T>(fetcher: typeof fetch, url: string, body: unknown): Promise<T> {
    return requestJson<T>(fetcher, url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
    });
}

async function requestJson<T>(fetcher: typeof fetch, url: string, options: RequestInit): Promise<T> {
    const response = await fetcher(url, options);
    const body = await response.json() as T | {error?: string};

    if (!response.ok) {
        const message = typeof body === 'object' && body && 'error' in body && typeof body.error === 'string'
            ? body.error
            : `Seed request failed with status ${response.status}.`;
        throw new Error(message);
    }

    return body as T;
}
