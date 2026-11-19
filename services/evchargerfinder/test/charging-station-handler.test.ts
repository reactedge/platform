import assert from 'node:assert/strict';
import test from 'node:test';
import type {Request, Response} from 'express';
import {ChargingStationHandler} from '../src/controller/charging-station-handler';
import {SearchError} from '../src/model/charging-station-search';

const createResponse = (search: (postcode: string, radiusKm: number) => Promise<unknown>) => {
    const responseState: {status: number; body: unknown} = {status: 200, body: undefined};
    const operation = {fail: () => undefined, succeed: () => undefined, setAttribute: () => undefined};
    const response = {
        app: {locals: {searchChargers: search}},
        locals: {routeOperation: operation},
        status(code: number) { responseState.status = code; return this; },
        json(body: unknown) { responseState.body = body; return this; },
    } as unknown as Response;
    return {response, responseState};
};

test('handler delegates a valid postcode and radius and returns the shared response shape', async () => {
    const calls: Array<[string, number]> = [];
    const result = {center: {lat: 51.5, lng: -0.1}, stations: []};
    const {response, responseState} = createResponse(async (postcode, radiusKm) => {
        calls.push([postcode, radiusKm]);
        return result;
    });
    await new ChargingStationHandler().nearby(
        {query: {postcode: 'SW1A 1AA', radiusKm: '25'}} as unknown as Request,
        response,
    );
    assert.equal(responseState.status, 200);
    assert.deepEqual(responseState.body, result);
    assert.deepEqual(calls, [['SW1A 1AA', 25]]);
});

test('handler rejects a missing postcode or unsupported radius before searching', async () => {
    let called = false;
    const search = async () => { called = true; return {}; };
    const handler = new ChargingStationHandler();
    for (const query of [{radiusKm: '10'}, {postcode: 'SW1A 1AA', radiusKm: '12'}]) {
        const {response, responseState} = createResponse(search);
        await handler.nearby({query} as unknown as Request, response);
        assert.equal(responseState.status, 400);
        assert.equal(typeof (responseState.body as {error?: unknown}).error, 'string');
    }
    assert.equal(called, false);
});

test('handler maps sanitized provider errors to their HTTP status', async () => {
    const {response, responseState} = createResponse(async () => {
        throw new SearchError('The charging station provider returned an error.', 502);
    });
    await new ChargingStationHandler().nearby(
        {query: {postcode: 'SW1A 1AA', radiusKm: '5'}} as unknown as Request,
        response,
    );
    assert.equal(responseState.status, 502);
    assert.deepEqual(responseState.body, {error: 'The charging station provider returned an error.'});
});
