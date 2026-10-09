import assert from 'node:assert/strict';
import {once} from 'node:events';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';
import express from 'express';
import {config} from '../src/config';
import {initialiseApp} from '../src/lib/initilisers';

test('listing creation requires and persists seller identity while updates preserve ownership', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'listing-seller-'));
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

        const missingSeller = await fetch(`${url}/listingrecord/listings`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: 'Gallery'}),
        });
        assert.equal(missingSeller.status, 400);

        const createdResponse = await fetch(`${url}/listingrecord/listings`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: 'Gallery', sellerId: 'seller-123'}),
        });
        assert.equal(createdResponse.status, 201);

        const created = await createdResponse.json() as {
            id: string;
            name: string;
            status: string;
            sellerId: string;
        };
        assert.equal(created.sellerId, 'seller-123');

        const updatedResponse = await fetch(`${url}/listingrecord/listings/${created.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: 'Updated Gallery',
                status: 'active',
                sellerId: 'seller-other',
            }),
        });
        assert.equal(updatedResponse.status, 200);

        const updated = await updatedResponse.json() as typeof created;
        assert.equal(updated.name, 'Updated Gallery');
        assert.equal(updated.sellerId, 'seller-123');
    } finally {
        if (server) {
            await new Promise<void>((resolve, reject) =>
                server!.close(error => error ? reject(error) : resolve()));
        }
        Object.assign(config, original);
        await rm(root, {recursive: true, force: true});
    }
});
