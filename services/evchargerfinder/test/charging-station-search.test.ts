import assert from 'node:assert/strict';
import test from 'node:test';
import {findNearbyChargers, SearchError} from '../src/model/charging-station-search';

const postcodeResponse = () => new Response(JSON.stringify({
    result: {latitude: 51.501, longitude: -0.142},
}), {status: 200, headers: {'content-type': 'application/json'}});

const stationResponse = () => new Response(JSON.stringify([{
    ID: 44,
    AddressInfo: {
        Title: 'Example Charge Point', AddressLine1: '1 Main Street', Town: 'London',
        Postcode: 'SW1A 1AA', Latitude: 51.502, Longitude: -0.142,
    },
    Connections: [{ConnectionType: {Title: 'CCS'}, PowerKW: 150, Quantity: 2}],
    StatusType: {IsOperational: true},
}]), {status: 200, headers: {'content-type': 'application/json'}});

test('resolves postcode and normalizes nearby Open Charge Map data', async () => {
    const calls: Array<{url: string; init?: RequestInit}> = [];
    const fetcher: typeof fetch = async (input, init) => {
        const url = String(input);
        calls.push({url, init});
        return url.includes('postcodes.io') ? postcodeResponse() : stationResponse();
    };
    const result = await findNearbyChargers('sw1a 1aa', 10, {fetcher, apiKey: 'test-key'});

    assert.equal(calls.length, 2);
    assert.match(calls[0]!.url, /SW1A%201AA$/);
    const ocmUrl = new URL(calls[1]!.url);
    assert.equal(ocmUrl.searchParams.get('distance'), '10');
    assert.equal(ocmUrl.searchParams.get('key'), 'test-key');
    assert.deepEqual(result.center, {lat: 51.501, lng: -0.142});
    assert.deepEqual(result.stations[0], {
        id: 44,
        name: 'Example Charge Point',
        address: '1 Main Street, London, SW1A 1AA',
        lat: 51.502,
        lng: -0.142,
        connectors: [{type: 'CCS', powerKw: 150, quantity: 2}],
        available: true,
        distanceKm: 0.1,
    });
});

test('rejects malformed UK postcodes before making upstream requests', async () => {
    let callCount = 0;
    const fetcher: typeof fetch = async () => {
        callCount += 1;
        return postcodeResponse();
    };
    await assert.rejects(
        findNearbyChargers('not a postcode', 5, {fetcher}),
        (error: unknown) => error instanceof SearchError && error.statusCode === 400,
    );
    assert.equal(callCount, 0);
});

test('maps an Open Charge Map rate limit to a retryable service error', async () => {
    const fetcher: typeof fetch = async (input) => String(input).includes('postcodes.io')
        ? postcodeResponse()
        : new Response('{}', {status: 429});
    await assert.rejects(
        findNearbyChargers('SW1A 1AA', 5, {fetcher}),
        (error: unknown) => error instanceof SearchError && error.statusCode === 503,
    );
});

test('maps upstream timeouts to gateway timeout responses', async () => {
    const fetcher: typeof fetch = async () => {
        throw new DOMException('timed out', 'TimeoutError');
    };
    await assert.rejects(
        findNearbyChargers('SW1A 1AA', 5, {fetcher}),
        (error: unknown) => error instanceof SearchError && error.statusCode === 504,
    );
});
