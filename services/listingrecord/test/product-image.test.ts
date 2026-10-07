import assert from 'node:assert/strict';
import {once} from 'node:events';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';
import express from 'express';
import {config} from '../src/config';
import {initialiseApp} from '../src/lib/initilisers';
import {createCloudinarySignature} from '../src/lib/cloudinary-signature';

async function fixture(run: (url: string) => Promise<void>) {
    const root = await mkdtemp(path.join(tmpdir(), 'product-image-'));
    const originalStorage = {rootDir: config.rootDir, cdnFolder: config.cdnFolder};
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
        if (server) await new Promise<void>((resolve, reject) => server!.close(error => error ? reject(error) : resolve()));
        Object.assign(config, originalStorage);
        await rm(root, {recursive: true, force: true});
    }
}

test('Cloudinary signature route returns signed upload parameters without the API secret', () => fixture(async url => {
    const original = {...config.cloudinary};
    Object.assign(config.cloudinary, {
        cloudName: 'reactedge-demo',
        apiKey: 'public-key',
        apiSecret: 'private-secret',
        folder: 'reactedge/products',
    });

    try {
        const response = await fetch(`${url}/listingrecord/product-images/signature`, {method: 'POST'});
        assert.equal(response.status, 200);

        const body = await response.json() as {
            cloudName: string;
            apiKey: string;
            timestamp: number;
            folder: string;
            signature: string;
            apiSecret?: string;
        };

        assert.equal(body.cloudName, 'reactedge-demo');
        assert.equal(body.apiKey, 'public-key');
        assert.equal(body.folder, 'reactedge/products');
        assert.equal(body.apiSecret, undefined);
        assert.equal(
            body.signature,
            createCloudinarySignature({timestamp: body.timestamp, folder: body.folder}, 'private-secret'),
        );
    } finally {
        Object.assign(config.cloudinary, original);
    }
}));

test('Cloudinary signature route fails when credentials are missing', () => fixture(async url => {
    const original = {...config.cloudinary};
    Object.assign(config.cloudinary, {cloudName: '', apiKey: '', apiSecret: '', folder: 'reactedge/products'});

    try {
        const response = await fetch(`${url}/listingrecord/product-images/signature`, {method: 'POST'});
        assert.equal(response.status, 503);
        assert.deepEqual(await response.json(), {error: 'Cloudinary is not configured.'});
    } finally {
        Object.assign(config.cloudinary, original);
    }
}));
