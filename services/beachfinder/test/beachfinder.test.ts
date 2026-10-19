import assert from 'node:assert/strict';
import express from 'express';
import type {Request, Response} from 'express';
import {test} from 'node:test';
import {BeachFinderHandler, parseBeachSearchQuery} from '../src/controller/beachfinder-handler';
import {BeachFinder} from '../src/model/beachfinder/beach-finder';
import routes from '../src/routes/index';

test('finds and sorts beaches within radius, including way centers', async () => {
    const calls: RequestInfo[] = [];
    const fetcher: typeof fetch = async (input) => {
        calls.push(input);
        if (String(input).includes('postcodes.io')) {
            return Response.json({status: 200, result: {latitude: 50, longitude: 0}});
        }
        return Response.json({elements: [
            {type: 'node', id: 2, lat: 50.01, lon: 0, tags: {name: 'Near Beach'}},
            {type: 'way', id: 3, center: {lat: 50.05, lon: 0}, tags: {name: 'Farther Beach'}},
            {type: 'node', id: 4, lat: 51, lon: 0}
        ]});
    };
    const finder = new BeachFinder(fetcher);
    const beaches = await finder.search('BN1 1AA', 10);
    assert.deepEqual(beaches.map(beach => beach.name), ['Near Beach', 'Farther Beach']);
    assert.equal(beaches[0].id, 'node/2');
    assert.ok(beaches[0].distanceMiles < beaches[1].distanceMiles);
    assert.equal(calls.length, 2);
});

test('validates UK postcodes and search radius values', () => {
    assert.deepEqual(parseBeachSearchQuery('BN1 1AA', '4'), {
        postcode: 'BN1 1AA', radiusMiles: 4
    });
    assert.equal(parseBeachSearchQuery('nope', '4'), null);
    assert.equal(parseBeachSearchQuery('BN1 1AA', '101'), null);
});

test('mounts status and beach search routes under the service router', () => {
    const app = express();
    routes(app, new BeachFinder(async () => Response.json({status: 200, result: {latitude: 50, longitude: 0}})));
    const routerStack = (app as unknown as {
        router: {stack: Array<{handle?: {stack?: Array<{route?: {path: string}}>} }>};
    }).router.stack;
    const registeredPaths = routerStack.flatMap(layer =>
        layer.handle?.stack?.flatMap(entry => entry.route ? [entry.route.path] : []) ?? []
    );

    assert.deepEqual(registeredPaths, ['/status', '/beaches']);
});

test('search handler returns beaches and records success', async () => {
    let succeeded = false;
    let responseBody: unknown;
    const finder = {search: async () => [{
        id: 'node/1', name: 'Test Beach', latitude: 50, longitude: 0, distanceMiles: 0
    }]};
    const handler = new BeachFinderHandler(finder as unknown as BeachFinder);
    const response = {
        locals: {routeOperation: {succeed: () => { succeeded = true; }, fail: () => undefined}},
        json: (body: unknown) => { responseBody = body; return response; },
        status: () => response,
    } as unknown as Response;

    await handler.search({query: {postcode: 'BN1 1AA', radiusMiles: '5'}} as unknown as Request, response);

    assert.equal(succeeded, true);
    assert.deepEqual(responseBody, {
        postcode: 'BN1 1AA', radiusMiles: 5,
        beaches: [{id: 'node/1', name: 'Test Beach', latitude: 50, longitude: 0, distanceMiles: 0}],
    });
});

test('search handler responds with 400 for an invalid query without provider calls', async () => {
    let statusCode = 0;
    let responseBody: unknown;
    let failed = false;
    const finder = {search: async () => { throw new Error('should not run'); }};
    const handler = new BeachFinderHandler(finder as unknown as BeachFinder);
    const response = {
        locals: {routeOperation: {succeed: () => undefined, fail: () => { failed = true; }}},
        json: (body: unknown) => { responseBody = body; return response; },
        status: (status: number) => { statusCode = status; return response; },
    } as unknown as Response;

    await handler.search({query: {postcode: 'not-a-postcode', radiusMiles: '5'}} as unknown as Request, response);

    assert.equal(statusCode, 400);
    assert.equal(failed, true);
    assert.deepEqual(responseBody, {error: 'Provide a valid UK postcode and radiusMiles from 0 to 100.'});
});
