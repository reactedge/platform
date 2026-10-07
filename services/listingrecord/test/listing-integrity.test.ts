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

const listingRequest = (name: string) => ({
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, sellerId: 'test-seller'}),
});

test('listing deletion is blocked while products reference the listing', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'listing-integrity-'));
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
        const url = `http://127.0.0.1:${address.port}`;

        const listing = await (
            await fetch(`${url}/listingrecord/listings`, listingRequest('Artworks'))
        ).json() as Listing;

        const product = await fetch(`${url}/listingrecord/products`, {
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
        assert.equal(product.status, 201);

        const deletion = await fetch(
            `${url}/listingrecord/listings/${listing.id}`,
            {method: 'DELETE'},
        );

        assert.equal(deletion.status, 409);
        assert.deepEqual(await deletion.json(), {
            error: 'Delete the 1 product assigned to this listing before deleting it.',
        });

        const listings = await (
            await fetch(`${url}/listingrecord/listings`)
        ).json() as Listing[];
        assert.deepEqual(listings, [listing]);
    } finally {
        if (server) {
            await new Promise<void>((resolve, reject) =>
                server!.close(error => error ? reject(error) : resolve()));
        }
        Object.assign(config, original);
        await rm(root, {recursive: true, force: true});
    }
});
