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

const productRequest = (listingId: string, overrides: Record<string, unknown> = {}) => ({
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        listingId,
        sku: 'ART-001',
        title: 'Blue study',
        description: 'Oil on canvas',
        price: 450,
        image: 'https://example.com/blue-study.jpg',
        ...overrides,
    }),
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

test('products are saved against an existing listing', () => fixture(async (url, directory) => {
    const listing = await (await fetch(`${url}/listingrecord/listings`, listingRequest('Artworks'))).json() as Listing;
    const response = await fetch(`${url}/listingrecord/products`, productRequest(listing.id));

    assert.equal(response.status, 201);
    const product = await response.json() as Product;
    assert.equal(product.listingId, listing.id);
    assert.equal(product.sku, 'ART-001');
    assert.equal(product.price, 450);

    assert.deepEqual(
        JSON.parse(await readFile(path.join(directory, 'products.json'), 'utf8')),
        [product],
    );
    assert.deepEqual(
        await (await fetch(`${url}/listingrecord/products`)).json(),
        [product],
    );
}));

test('products reject invalid data and unknown listings', () => fixture(async (url) => {
    const unknownListing = '11111111-1111-4111-8111-111111111111';
    assert.equal((await fetch(`${url}/listingrecord/products`, productRequest(unknownListing))).status, 404);

    const listing = await (await fetch(`${url}/listingrecord/listings`, listingRequest('Artworks'))).json() as Listing;
    for (const overrides of [
        {sku: ''},
        {title: ''},
        {description: ''},
        {price: -1},
        {price: '450'},
        {image: 'not-a-url'},
    ]) {
        assert.equal((await fetch(`${url}/listingrecord/products`, productRequest(listing.id, overrides))).status, 400);
    }
}));
