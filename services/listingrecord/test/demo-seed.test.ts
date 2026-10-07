import assert from 'node:assert/strict';
import {once} from 'node:events';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';
import express from 'express';
import {config} from '../src/config';
import {initialiseApp} from '../src/lib/initilisers';
import {seedDemoData, seedListings} from '../src/seed/demo-seed';

test('demo seed creates four listings and three products per listing without duplicates', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'listingrecord-seed-'));
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

        assert.deepEqual(await seedDemoData(url), {listingsCreated: 4, productsCreated: 12});
        assert.deepEqual(await seedDemoData(url), {listingsCreated: 0, productsCreated: 0});

        const listings = await (await fetch(`${url}/listingrecord/listings`)).json() as Array<{id: string; name: string}>;
        const products = await (await fetch(`${url}/listingrecord/products`)).json() as Array<{
            listingId: string;
            sku: string;
            images: unknown[];
        }>;

        assert.equal(listings.length, 4);
        assert.equal(products.length, 12);
        assert.ok(products.every(product => product.listingId.length > 0));
        assert.ok(products.every(product => product.images.length === 0));

        for (const seed of seedListings) {
            const listing = listings.find(record => record.name === seed.name);
            assert.ok(listing);
            assert.equal(products.filter(product => product.listingId === listing.id).length, 3);
        }
    } finally {
        if (server) await new Promise<void>((resolve, reject) => server!.close(error => error ? reject(error) : resolve()));
        Object.assign(config, original);
        await rm(root, {recursive: true, force: true});
    }
});

test('demo seed rejects listing responses without a valid UUID', async () => {
    const fetcher = async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
        const url = String(input);

        if (url.endsWith('/listings') && init?.method === 'GET') {
            return Response.json([{id: '', name: 'Seed Listing 1'}]);
        }
        if (url.endsWith('/products') && init?.method === 'GET') {
            return Response.json([]);
        }

        return Response.json({error: 'Unexpected request'}, {status: 500});
    };

    await assert.rejects(
        () => seedDemoData('http://127.0.0.1:4180', fetcher as typeof fetch),
        /Invalid UUID|invalid/i,
    );
});
