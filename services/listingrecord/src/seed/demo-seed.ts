import {ListingSchema, ListingsSchema, type Listing} from '../model/listing/types.ts';
import {ProductSchema, ProductsSchema, type Product} from '../model/product/types.ts';

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
    const listings = ListingsSchema.parse(await getJson(fetcher, `${baseUrl}/listings`));
    const products = ProductsSchema.parse(await getJson(fetcher, `${baseUrl}/products`));

    let listingsCreated = 0;
    let productsCreated = 0;

    for (const seed of seedListings) {
        const existing = listings.find(listing => listing.name === seed.name);
        const listing = existing ?? ListingSchema.parse(
            await postJson(fetcher, `${baseUrl}/listings`, {name: seed.name}),
        );

        if (!existing) {
            listings.push(listing);
            listingsCreated += 1;
        }

        for (const product of seed.products) {
            if (products.some(record => record.sku === product.sku)) continue;

            const created = ProductSchema.parse(await postJson(fetcher, `${baseUrl}/products`, {
                ...product,
                listingId: listing.id,
            }));
            products.push(created);
            productsCreated += 1;
        }
    }

    return {listingsCreated, productsCreated};
}

async function getJson(fetcher: typeof fetch, url: string): Promise<unknown> {
    return requestJson(fetcher, url, {method: 'GET'});
}

async function postJson(fetcher: typeof fetch, url: string, body: unknown): Promise<unknown> {
    return requestJson(fetcher, url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
    });
}

async function requestJson(fetcher: typeof fetch, url: string, options: RequestInit): Promise<unknown> {
    const response = await fetcher(url, options);
    const body = await response.json() as unknown;

    if (!response.ok) {
        const message = typeof body === 'object' && body && 'error' in body && typeof body.error === 'string'
            ? body.error
            : `Seed request failed with status ${response.status}.`;
        throw new Error(message);
    }

    return body;
}
