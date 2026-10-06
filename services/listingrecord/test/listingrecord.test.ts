import assert from 'node:assert/strict';
import {once} from 'node:events';
import {mkdtemp, readFile, rm, symlink, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';
import express from 'express';
import {config} from '../src/config';
import {initialiseApp} from '../src/lib/initilisers';
import {prepareStorageAccess, storageDirectory} from '../src/access/staticFile';
import {ListingStore} from '../src/model/listing/listing-store';
import type {Listing} from '../src/model/listing/types';

const json = (name: unknown) => ({method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name})});

async function fixture(run: (url: string, directory: string) => Promise<void>) {
    const root = await mkdtemp(path.join(tmpdir(), 'listingrecord-'));
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

test('status, create and list use the configured access folder and persist across store restarts', () => fixture(async (url, directory) => {
    assert.deepEqual(await (await fetch(`${url}/listingrecord/status`)).json(), {status: 'ok'});
    assert.deepEqual(await (await fetch(`${url}/listingrecord/listings`)).json(), []);
    const response = await fetch(`${url}/listingrecord/listings`, json('  Summer products  '));
    assert.equal(response.status, 201);
    const record = await response.json() as Listing;
    assert.equal(record.name, 'Summer products');
    assert.deepEqual(await new ListingStore(directory).list(), [record]);
    assert.deepEqual(JSON.parse(await readFile(path.join(directory, 'listings.json'), 'utf8')), [record]);
    assert.deepEqual(await (await fetch(`${url}/listingrecord/listings`)).json(), [record]);
    const staticResponse = await fetch(`${url}/records/listings.json`);
    assert.equal(staticResponse.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await staticResponse.json(), [record]);
}));

test('names, malformed JSON and oversized requests are rejected', () => fixture(async (url) => {
    for (const name of ['', '   ', 'x'.repeat(51), 42]) {
        assert.equal((await fetch(`${url}/listingrecord/listings`, json(name))).status, 400);
    }
    assert.equal((await fetch(`${url}/listingrecord/listings`, json('x'.repeat(50)))).status, 201);
    assert.equal((await fetch(`${url}/listingrecord/listings`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: '{'})).status, 400);
    assert.equal((await fetch(`${url}/listingrecord/listings`, json('x'.repeat(5000)))).status, 413);
    const preflight = await fetch(`${url}/listingrecord/listings`, {
        method: 'OPTIONS', headers: {Origin: 'http://localhost:5173', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'Content-Type'},
    });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get('access-control-allow-origin'), 'http://localhost:5173');
    assert.match(preflight.headers.get('access-control-allow-headers') || '', /Content-Type/i);
}));

test('concurrent saves retain every record', () => fixture(async (url, directory) => {
    const responses = await Promise.all(Array.from({length: 12}, (_, i) => fetch(`${url}/listingrecord/listings`, json(`Listing ${i}`))));
    assert.ok(responses.every(response => response.status === 201));
    const records = await new ListingStore(directory).list();
    assert.equal(records.length, 12);
    assert.equal(new Set(records.map(record => record.id)).size, 12);
}));

test('corrupt files fail safely and are not overwritten', () => fixture(async (url, directory) => {
    const file = path.join(directory, 'listings.json');
    for (const content of ['invalid JSON', '[{"id":"bad","name":"Test"}]']) {
        await writeFile(file, content);
        assert.equal((await fetch(`${url}/listingrecord/listings`)).status, 500);
        assert.equal((await fetch(`${url}/listingrecord/listings`, json('New listing'))).status, 500);
        assert.equal(await readFile(file, 'utf8'), content);
    }
}));

test('a listing file symlink is never followed for persistence', () => fixture(async (url, directory) => {
    const outside = path.join(path.dirname(directory), 'outside.json');
    await writeFile(outside, '[]');
    await symlink(outside, path.join(directory, 'listings.json'));
    assert.equal((await fetch(`${url}/listingrecord/listings`)).status, 500);
    assert.equal((await fetch(`${url}/listingrecord/listings`, json('New listing'))).status, 500);
    assert.equal(await readFile(outside, 'utf8'), '[]');
}));

test('access folders cannot escape the configured root', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'listingrecord-access-'));
    const outside = await mkdtemp(path.join(tmpdir(), 'listingrecord-outside-'));
    const original = {rootDir: config.rootDir, cdnFolder: config.cdnFolder};
    try {
        config.rootDir = root;
        for (const folder of ['../escape', outside, '.', '']) {
            config.cdnFolder = folder;
            assert.throws(() => storageDirectory());
        }
        await symlink(outside, path.join(root, 'linked'));
        config.cdnFolder = 'linked/records';
        await assert.rejects(prepareStorageAccess(), /inside ROOT_DIR/);
    } finally {
        Object.assign(config, original);
        await rm(root, {recursive: true, force: true});
        await rm(outside, {recursive: true, force: true});
    }
});
