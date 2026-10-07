import assert from 'node:assert/strict';
import {once} from 'node:events';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';
import express from 'express';
import {config} from '../src/config';
import {initialiseApp} from '../src/lib/initilisers';

async function fixture(run: (url: string) => Promise<void>) {
    const root = await mkdtemp(path.join(tmpdir(), 'listing-status-'));
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

test('listing status defaults to active and can be updated', () => fixture(async url => {
    const createdResponse = await fetch(`${url}/listingrecord/listings`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: 'Gallery'}),
    });
    assert.equal(createdResponse.status, 201);

    const created = await createdResponse.json() as {id: string; name: string; status: string};
    assert.equal(created.status, 'active');

    const updatedResponse = await fetch(`${url}/listingrecord/listings/${created.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: 'Gallery', status: 'inreview'}),
    });
    assert.equal(updatedResponse.status, 200);

    const updated = await updatedResponse.json() as {status: string};
    assert.equal(updated.status, 'inreview');
}));

test('listing status rejects unknown values', () => fixture(async url => {
    const response = await fetch(`${url}/listingrecord/listings`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: 'Gallery', status: 'archived'}),
    });

    assert.equal(response.status, 400);
}));
