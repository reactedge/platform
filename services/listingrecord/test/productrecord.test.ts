import assert from 'node:assert/strict';
import {once} from 'node:events';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';
import express, {type Application} from 'express';
import {config} from '../src/config';
import {initialiseApp} from '../src/lib/initilisers';
import type {Listing} from '../src/model/listing/types';
import type {Product} from '../src/model/product/types';

const listingRequest = (name: string) => ({
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name}),
});

const images = [
    {url: 'https://example.com/blue-study-1.jpg', publicId: 'reactedge/products/blue-study-1'},
    {url: 'https://example.com/blue-study-2.jpg', publicId: 'reactedge/products/blue-study-2'},
];

const productPayload = (listingId: string, overrides: Record<string, unknown> = {}) => ({
    listingId,
    sku: 'ART-001',
    title: 'Blue study',
    description: 'Oil on canvas',
    price: 3.70,
    images,
    ...overrides,
});

const productRequest = (listingId: string, overrides: Record<string, unknown> = {}, method = 'POST') => ({
    method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(productPayload(listingId, overrides)),
});

async function fixture(run: (url: string, directory: string, app: Application) => Promise<void>) {
    const root = await mkdtemp(path.join(tmpdir(), 'productrecord-'));
    const original = {rootDir: config.rootDir, cdnFolder: config.cdnFolder};
    config.rootDir = root;
    config.cdnFolder = 'records';
    const app = express();
    let server;
    try {
        await initialiseApp(app);
        server = app.listen(0, '127.0.0.1');
        await once(server, 'listening');
        const address = server.address();
        assert.ok(address && typeof address !== 'string');
        await run(`http://127.0.0.1:${address.port}`, path.join(root, 'records'), app);
    } finally {
        if (server) await new Promise<void>((resolve, reject) => server!.close(error => error ? reject(error) : resolve()));
        Object.assign(config, original);
        await rm(root, {recursive: true, force: true});
    }
}

test('products accept UUID listing IDs, hyphenated SKUs and two-decimal prices', () => fixture(async (url, directory) => {
    const listing = await (await fetch(`${url}/listingrecord/listings`, listingRequest('Artworks'))).json() as Listing;
    const response = await fetch(`${url}/listingrecord/products`, productRequest(listing.id, {sku: 'ART-001-2026'}));

    assert.equal(response.status, 201);
    const product = await response.json() as Product;
    assert.equal(product.listingId, listing.id);
    assert.equal(product.sku, 'ART-001-2026');
    assert.equal(product.price, 3.7);
    assert.deepEqual(JSON.parse(await readFile(path.join(directory, 'products.json'), 'utf8')), [product]);
}));

test('products may be saved without images', () => fixture(async (url) => {
    const listing = await (await fetch(`${url}/listingrecord/listings`, listingRequest('Artworks'))).json() as Listing;
    const response = await fetch(`${url}/listingrecord/products`, productRequest(listing.id, {images: []}));

    assert.equal(response.status, 201);
    const product = await response.json() as Product;
    assert.deepEqual(product.images, []);
}));

test('products reject invalid product details', () => fixture(async (url) => {
    const listing = await (await fetch(`${url}/listingrecord/listings`, listingRequest('Artworks'))).json() as Listing;

    for (const [listingId, overrides] of [
        ['', {}],
        [listing.id, {sku: 'TOO-LONG-SKU-1234'}],
        [listing.id, {sku: 'ART_001'}],
        [listing.id, {title: '<b>Blue study</b>'}],
        [listing.id, {price: 3.701}],
    ] as Array<[string, Record<string, unknown>]>) {
        assert.equal((await fetch(`${url}/listingrecord/products`, productRequest(listingId, overrides))).status, 400);
    }
}));

test('products reject invalid image collections', () => fixture(async (url) => {
    const listing = await (await fetch(`${url}/listingrecord/listings`, listingRequest('Artworks'))).json() as Listing;

    for (const overrides of [
        {images: [{url: 'not-a-url', publicId: 'one'}]},
        {images: [{url: 'https://example.com/a.jpg', publicId: ''}]},
        {images: Array.from({length: 11}, (_, index) => ({
            url: `https://example.com/${index}.jpg`,
            publicId: `reactedge/products/${index}`,
        }))},
    ]) {
        assert.equal((await fetch(`${url}/listingrecord/products`, productRequest(listing.id, overrides))).status, 400);
    }
}));

test('deleting a product deletes every Cloudinary image before deleting the record', () => fixture(async (url, directory, app) => {
    const listing = await (await fetch(`${url}/listingrecord/listings`, listingRequest('Artworks'))).json() as Listing;
    const created = await (await fetch(`${url}/listingrecord/products`, productRequest(listing.id))).json() as Product;
    const deletedImages: string[] = [];

    app.locals.productImages = {
        deleteMany: async (publicIds: string[]) => {
            deletedImages.push(...publicIds);
        },
    };

    const response = await fetch(`${url}/listingrecord/products/${created.id}`, {method: 'DELETE'});

    assert.equal(response.status, 204);
    assert.deepEqual(deletedImages, images.map(image => image.publicId));
    assert.deepEqual(JSON.parse(await readFile(path.join(directory, 'products.json'), 'utf8')), []);
}));

test('a failed image cleanup keeps the product record', () => fixture(async (url, directory, app) => {
    const listing = await (await fetch(`${url}/listingrecord/listings`, listingRequest('Artworks'))).json() as Listing;
    const created = await (await fetch(`${url}/listingrecord/products`, productRequest(listing.id))).json() as Product;

    app.locals.productImages = {
        deleteMany: async () => {
            throw new Error('Cloudinary unavailable');
        },
    };

    const response = await fetch(`${url}/listingrecord/products/${created.id}`, {method: 'DELETE'});

    assert.equal(response.status, 500);
    assert.deepEqual(JSON.parse(await readFile(path.join(directory, 'products.json'), 'utf8')), [created]);
}));
