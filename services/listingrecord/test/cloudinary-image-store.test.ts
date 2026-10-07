import assert from 'node:assert/strict';
import test from 'node:test';
import {CloudinaryImageStore} from '../src/model/product/cloudinary-image-store';

test('Cloudinary image cleanup destroys every public ID', async () => {
    const requests: string[] = [];
    const fetcher = async (_url: string | URL | Request, init?: RequestInit) => {
        requests.push(String(init?.body));
        return new Response(JSON.stringify({result: 'ok'}), {
            status: 200,
            headers: {'Content-Type': 'application/json'},
        });
    };

    const store = new CloudinaryImageStore({
        cloudName: 'reactedge-demo',
        apiKey: 'public-key',
        apiSecret: 'private-secret',
        folder: 'reactedge/products',
    }, fetcher as typeof fetch);

    await store.deleteMany([
        'reactedge/products/one',
        'reactedge/products/two',
    ]);

    assert.equal(requests.length, 2);
    assert.ok(requests.some(body => body.includes('public_id=reactedge%2Fproducts%2Fone')));
    assert.ok(requests.some(body => body.includes('public_id=reactedge%2Fproducts%2Ftwo')));
    assert.ok(requests.every(body => body.includes('api_key=public-key')));
});
