import assert from 'node:assert/strict';
import {once} from 'node:events';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';
import express from 'express';
import {config} from '../src/config';
import {initialiseApp} from '../src/lib/initilisers';
import type {Listing} from '../src/model/listing/types';
import type {Product} from '../src/model/product/types';

const listingRequest = (name: string) => ({
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name}),
});

const productPayload = (listingId: string, overrides: Record<string, unknown> = {}) => ({
    listingId,
    sku: 'ART-001',
    title: 'Blue study',
    description: 'Oil on canvas',
    price: 450,
    images: [
        'https://example.com/blue-study-1.jpg',
        'https://example.com/blue-study-2.jpg',
    ],
    ...overrides,
});

const productRequest = (listingId: string, overrides: Record<string, unknown> = {}, method = 'POST') => ({
    method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(productPayload(listingId, overrides)),
});

async function fixture(run: (url: string, directory: string) => Promise<void>) {
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
        await run(`http://127.0.0.1:${address.port}`, path.join(root, 'records'));
    } finally {
        if (server) await new Promise<void>((resolve, reject) => server!.close(error => error ? reject(error) : resolve()));
        Object.assign(config, original);
        await rm(root, {recursive: true, force: true});
    }
}

test('products are saved against an existing listing with multiple images', () => fixture(async (url, directory) => {
    const listing = await (await fetch(`${url}/listingrecord/listings`, listingRequest('Artworks'))).json() as Listing;
    const response = await fetch(`${url}/listingrecord/products`, productRequest(listing.id));

    assert.equal(response.status, 201);
    const product = await response.json() as Product;
    assert.equal(product.listingId, listing.id);
    assert.equal(product.sku, 'ART-001');
    assert.equal(product.images.length, 2);

    assert.deepEqual(
        JSON.parse(await readFile(path.join(directory, 'products.json'), 'utf8')),
        [product],
    );
}));

test('products reject invalid image collections', () => fixture(async (url) => {
    const listing = await (await fetch(`${url}/listingrecord/listings`, listingRequest('Artworks'))).json() as Listing;

    for (const overrides of [
        {images: []},
        {images: ['not-a-url']},
        {images: Array.from({length: 11}, (_, index) => `https://example.com/${index}.jpg`)},
    ]) {
        assert.equal((await fetch(`${url}/listingrecord/products`, productRequest(listing.id, overrides))).status, 400);
    }
}));

test('products can be edited and deleted without changing their listing relationship', () => fixture(async (url, directory) => {
    const listing = await (await fetch(`${url}/listingrecord/listings`, listingRequest('Artworks'))).json() as Listing;
    const created = await (await fetch(`${url}/listingrecord/products`, productRequest(listing.id))).json() as Product;
    const item = `${url}/listingrecord/products/${created.id}`;

    const updatedResponse = await fetch(item, productRequest(listing.id, {
        title: 'Red study',
        images: ['https://example.com/red-study.jpg'],
    }, 'PUT'));
    assert.equal(updatedResponse.status, 200);

    const updated = await updatedResponse.json() as Product;
    assert.equal(updated.id, created.id);
    assert.equal(updated.listingId, listing.id);
    assert.deepEqual(updated.images, ['https://example.com/red-study.jpg']);

    assert.equal((await fetch(item, {method: 'DELETE'})).status, 204);
    assert.deepEqual(JSON.parse(await readFile(path.join(directory, 'products.json'), 'utf8')), []);
}));
