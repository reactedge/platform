import assert from 'node:assert/strict';
import test from 'node:test';
import type {AddressInfo} from 'node:net';
import {createApp} from '../src/app';

async function withServer<T>(run: (baseUrl: string) => Promise<T>, searchNearby?: Parameters<typeof createApp>[0]) {
    const server = createApp(searchNearby).listen(0);
    await new Promise<void>((resolve) => server.once('listening', resolve));
    const address = server.address() as AddressInfo;
    try {
        return await run(`http://127.0.0.1:${address.port}`);
    } finally {
        await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
}

test('GET /golfcourses/nearby returns the normalized search result', async () => {
    const calls: Array<[string, number]> = [];
    await withServer(async (baseUrl) => {
        const response = await fetch(`${baseUrl}/golfcourses/nearby?postcode=GU25%204LH&radius_miles=12`);
        assert.equal(response.status, 200);
        assert.deepEqual(await response.json(), {
            postcode: 'GU25 4LH',
            radius_miles: 12,
            total: 0,
            courses: [],
        });
    }, async (postcode, radiusMiles) => {
        calls.push([postcode, radiusMiles]);
        return {postcode, radius_miles: radiusMiles, total: 0, courses: []};
    });
    assert.deepEqual(calls, [['GU25 4LH', 12]]);
});

test('GET /golfcourses/nearby rejects missing postcodes and excessive radii', async () => {
    await withServer(async (baseUrl) => {
        const missingPostcode = await fetch(`${baseUrl}/golfcourses/nearby?radius_miles=10`);
        assert.equal(missingPostcode.status, 400);
        const excessiveRadius = await fetch(`${baseUrl}/golfcourses/nearby?postcode=GU25%204LH&radius_miles=101`);
        assert.equal(excessiveRadius.status, 400);
    }, async () => {
        throw new Error('Search should not run for invalid query parameters.');
    });
});
