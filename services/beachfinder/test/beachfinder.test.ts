import assert from 'node:assert/strict';
import {test} from 'node:test';
import {BeachFinder} from '../src/model/beachfinder';
import {parseBeachSearchQuery} from '../src/routes/beach-router';

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
