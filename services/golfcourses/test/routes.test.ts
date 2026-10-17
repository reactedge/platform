import assert from 'node:assert/strict';
import {after, before, test} from 'node:test';
import type {AddressInfo} from 'node:net';
import express from 'express';
import {initialiseApp} from '../src/lib/initilisers';
import type {GolfCourseSearchResult} from '../src/model/golf-course/golf-course-search';

let baseUrl: string;
let server: ReturnType<ReturnType<typeof express>['listen']>;
const searchCalls: Array<[string, number]> = [];

before(async () => {
    const app = express();
    const searchGolfCourses = async (postcode: string, radiusMiles: number): Promise<GolfCourseSearchResult> => {
        searchCalls.push([postcode, radiusMiles]);
        return {postcode, radius_miles: radiusMiles, total: 0, courses: []};
    };
    await initialiseApp(app, searchGolfCourses);
    app.locals.telemetry = {
        startOperation: () => fakeOperation,
        startChildOperation: () => fakeOperation,
    };
    server = app.listen(0);
    await new Promise<void>((resolve) => server.once('listening', resolve));
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

const fakeOperation = {
    fail: () => undefined,
    complete: () => undefined,
    succeed: () => undefined,
    setAttribute: () => undefined,
    end: () => undefined,
};

test('GET /golfcourses/nearby returns the normalized search result', async () => {
    const response = await fetch(`${baseUrl}/golfcourses/nearby?postcode=GU25%204LH&radius_miles=12`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
        postcode: 'GU25 4LH',
        radius_miles: 12,
        total: 0,
        courses: [],
    });
    assert.deepEqual(searchCalls, [['GU25 4LH', 12]]);
});

test('GET /golfcourses/nearby rejects missing postcodes and excessive radii', async () => {
    const missingPostcode = await fetch(`${baseUrl}/golfcourses/nearby?radius_miles=10`);
    assert.equal(missingPostcode.status, 400);
    const excessiveRadius = await fetch(`${baseUrl}/golfcourses/nearby?postcode=GU25%204LH&radius_miles=101`);
    assert.equal(excessiveRadius.status, 400);
    assert.equal(searchCalls.length, 1);
});
