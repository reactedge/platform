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
    const root = await mkdtemp(path.join(tmpdir(), 'listing-validation-'));
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

test('listing validation distinguishes name and status errors', () => fixture(async url => {
    const invalidName = await fetch(`${url}/listingrecord/listings`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: '', status: 'active'}),
    });
    assert.equal(invalidName.status, 400);
    assert.deepEqual(await invalidName.json(), {
        error: 'Enter a listing name between 1 and 50 characters.',
    });

    const invalidStatus = await fetch(`${url}/listingrecord/listings`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: 'Gallery', status: 'archived'}),
    });
    assert.equal(invalidStatus.status, 400);
    assert.deepEqual(await invalidStatus.json(), {
        error: 'Choose a valid listing status.',
    });
}));
