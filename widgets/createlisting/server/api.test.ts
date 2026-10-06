import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import test from 'node:test';
import { ListingStore } from './store.ts';
import { createListingsApi } from './api.ts';
import type { Listing } from '../src/models/listing.ts';

async function fixture(run: (url: string, file: string) => Promise<void>) {
    const directory = await mkdtemp(join(tmpdir(), 'reactedge-listings-'));
    const file = join(directory, 'listings.json');
    const handler = createListingsApi(new ListingStore(file));
    const server = createServer((request, response) => { void handler(request, response); });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    try { await run(`http://127.0.0.1:${address.port}/api/listings`, file); }
    finally {
        await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
        await rm(directory, { recursive: true, force: true });
    }
}

const json = (method: string, body: unknown) => ({
    method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

test('CRUD persists records across store restarts', () => fixture(async (url, file) => {
    assert.deepEqual(await (await fetch(url)).json(), []);
    const created = await fetch(url, json('POST', { name: '  Summer products  ' }));
    assert.equal(created.status, 201);
    const record = await created.json() as Listing;
    assert.equal(record.name, 'Summer products');
    assert.deepEqual(await new ListingStore(file).list(), [record]);
    const edited = await fetch(`${url}/${record.id}`, json('PUT', { name: 'Winter products' }));
    assert.equal(edited.status, 200);
    assert.deepEqual(await new ListingStore(file).list(), [{ ...record, name: 'Winter products' }]);
    assert.equal((await fetch(`${url}/${record.id}`, { method: 'DELETE' })).status, 204);
    assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), []);
    assert.equal((await fetch(`${url}/${record.id}`, json('PUT', { name: 'Missing' }))).status, 404);
    assert.equal((await fetch(`${url}/${record.id}`, { method: 'DELETE' })).status, 404);
}));

test('validates names and JSON on create and update', () => fixture(async (url, file) => {
    for (const name of ['', '   ', 'x'.repeat(51), 42]) {
        assert.equal((await fetch(url, json('POST', { name }))).status, 400);
    }
    const created = await fetch(url, json('POST', { name: 'x'.repeat(50) }));
    const record = await created.json() as Listing;
    assert.equal(created.status, 201);
    assert.equal((await fetch(`${url}/${record.id}`, json('PUT', { name: 'x'.repeat(51) }))).status, 400);
    assert.equal((await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })).status, 400);
    assert.equal((await fetch(url, { method: 'POST', body: 'text' })).status, 415);
    assert.equal((await fetch(url, json('POST', { name: 'x'.repeat(9000) }))).status, 413);
    assert.equal((await fetch(url, { ...json('POST', { name: 'Cross-origin' }), headers: { 'Content-Type': 'application/json', Origin: 'https://other.example' } })).status, 403);
    assert.equal((await fetch(url, { method: 'PATCH' })).status, 405);
    assert.equal((await fetch(`${url}/invalid`, { method: 'DELETE' })).status, 404);
    assert.deepEqual(await new ListingStore(file).list(), [record]);
}));

test('concurrent writes retain all records with separate IDs', () => fixture(async (url, file) => {
    const responses = await Promise.all(Array.from({ length: 12 }, () => fetch(url, json('POST', { name: 'Same name' }))));
    assert.ok(responses.every(response => response.status === 201));
    const records = await new ListingStore(file).list();
    assert.equal(records.length, 12);
    assert.equal(new Set(records.map(record => record.id)).size, 12);
}));

test('corrupt storage is reported and never overwritten', () => fixture(async (url, file) => {
    for (const contents of ['broken JSON', '[{"id":"invalid","name":"Record"}]']) {
        await writeFile(file, contents);
        assert.equal((await fetch(url)).status, 500);
        assert.equal((await fetch(url, json('POST', { name: 'New record' }))).status, 500);
        assert.equal(await readFile(file, 'utf8'), contents);
    }
}));
