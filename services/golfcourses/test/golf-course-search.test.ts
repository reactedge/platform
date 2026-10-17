import assert from 'node:assert/strict';
import test from 'node:test';
import {findNearbyGolfCourses, SearchError} from '../src/golf-course-search';

const postcodeResponse = () => new Response(JSON.stringify({
    result: {postcode: 'SW1A 1AA', latitude: 51.501, longitude: -0.142},
}), {status: 200, headers: {'content-type': 'application/json'}});

test('resolves a postcode, converts miles to kilometres and returns nearby courses in miles', async () => {
    const requests: Array<{url: string; init?: RequestInit}> = [];
    const fetcher: typeof fetch = async (input, init) => {
        const url = String(input);
        requests.push({url, init});
        if (url.includes('postcodes.io')) return postcodeResponse();
        return new Response(JSON.stringify({
            data: [{id: 'club-1', name: 'Example Golf Club', distance_km: 8.047}],
            meta: {total: 1},
        }), {status: 200, headers: {'content-type': 'application/json'}});
    };

    const result = await findNearbyGolfCourses(' sw1a   1aa ', 5, {
        fetcher,
        rapidApiKey: 'test-key',
    });

    assert.equal(requests.length, 2);
    assert.match(requests[0]!.url, /SW1A%201AA$/);
    const golfUrl = new URL(requests[1]!.url);
    assert.equal(golfUrl.searchParams.get('lat'), '51.501');
    assert.equal(golfUrl.searchParams.get('lng'), '-0.142');
    assert.equal(Number(golfUrl.searchParams.get('radius_km')), 8.04672);
    assert.equal(new Headers(requests[1]!.init?.headers).get('X-RapidAPI-Key'), 'test-key');
    assert.equal(result.postcode, 'SW1A 1AA');
    assert.equal(result.radius_miles, 5);
    assert.equal(result.total, 1);
    assert.equal(result.courses[0]?.distance_miles, 5);
});

test('rejects a postcode that the postcode service does not recognise', async () => {
    const fetcher: typeof fetch = async () => new Response(JSON.stringify({result: null}), {status: 404});

    await assert.rejects(
        findNearbyGolfCourses('NOT A POSTCODE', 10, {fetcher, rapidApiKey: 'test-key'}),
        (error: unknown) => error instanceof SearchError && error.statusCode === 400,
    );
});

test('fails clearly when the RapidAPI key is not configured', async () => {
    await assert.rejects(
        findNearbyGolfCourses('SW1A 1AA', 10, {rapidApiKey: ''}),
        (error: unknown) => error instanceof SearchError && error.statusCode === 503,
    );
});

test('turns provider rate limits into a retryable service response', async () => {
    const fetcher: typeof fetch = async (input) => String(input).includes('postcodes.io')
        ? postcodeResponse()
        : new Response('{}', {status: 429});

    await assert.rejects(
        findNearbyGolfCourses('SW1A 1AA', 10, {fetcher, rapidApiKey: 'test-key'}),
        (error: unknown) => error instanceof SearchError && error.statusCode === 503,
    );
});
