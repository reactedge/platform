import assert from 'node:assert/strict';
import {once} from 'node:events';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';
import express from 'express';
import {config} from '../src/config';
import {initialiseApp} from '../src/lib/initilisers';
import type {Listing} from '../src/model/listing/types';

async function fixture(run: (url: string) => Promise<void>) {
    const root = await mkdtemp(path.join(tmpdir(), 'product-status-'));
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
        await run(`http://127.0.0.1:${address.port}`);
    } finally {
        if (server) await new Promise<void>((resolve, reject) =>
            server!.close(error => error ? reject(error) : resolve()));
        Object.assign(config, original);
        await rm(root, {recursive: true, force: true});
    }
}

test('product status defaults to active and can be updated', () => fixture(async url => {
    const listingResponse = await fetch(`${url}/listingrecord/listings`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: 'Gallery'}),
    });
    const listing = await listingResponse.json() as Listing;

    const productResponse = await fetch(`${url}/listingrecord/products`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            listingId: listing.id,
            sku: 'ART-001',
            title: 'Blue study',
            description: 'Oil on canvas',
            price: 3.7,
            images: [],
        }),
    });
    assert.equal(productResponse.status, 201);

    const product = await productResponse.json() as {id: string; status: string};
    assert.equal(product.status, 'active');

    const updateResponse = await fetch(`${url}/listingrecord/products/${product.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            listingId: listing.id,
            sku: 'ART-001',
            title: 'Blue study',
            description: 'Oil on canvas',
            price: 3.7,
            status: 'inreview',
            images: [],
        }),
    });
    assert.equal(updateResponse.status, 200);

    const updated = await updateResponse.json() as {status: string};
    assert.equal(updated.status, 'inreview');
}));

test('product status rejects unknown values', () => fixture(async url => {
    const listingResponse = await fetch(`${url}/listingrecord/listings`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: 'Gallery'}),
    });
    const listing = await listingResponse.json() as Listing;

    const response = await fetch(`${url}/listingrecord/products`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            listingId: listing.id,
            sku: 'ART-001',
            title: 'Blue study',
            description: 'Oil on canvas',
            price: 3.7,
            status: 'archived',
            images: [],
        }),
    });

    assert.equal(response.status, 400);
}));
