import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {once} from 'node:events';
import {createCmsBlockServer} from '../src/server.mjs';

test('persist, generate, review, approve, reload and regenerate while published stays intact', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'reactedge-cmsblock-'));
    const server = createCmsBlockServer({directory});
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    try {
        const address = server.address();
        assert.ok(address && typeof address !== 'string');
        const base = `http://127.0.0.1:${address.port}/cmsblock/blocks/demo`;
        const draft = {source: {format: 'html', content: '<h2>Welcome</h2><p>Our collection</p><script>alert(1)</script>'}, templateId: 'feature'};
        const request = async (suffix, method, body) => {
            const response = await fetch(base + suffix, {method, headers: {'Content-Type': 'application/json'}, ...(body && {body: JSON.stringify(body)})});
            return {status: response.status, data: await response.json()};
        };

        assert.equal((await request('', 'GET')).status, 404);
        assert.equal((await request('', 'PUT', draft)).data.templateId, 'feature');

        const generated = (await request('/generate', 'POST')).data;
        assert.equal(generated.pending.status, 'inreview');
        assert.match(generated.pending.html, /Welcome/);
        assert.doesNotMatch(generated.pending.html, /<script/i);
        assert.match(generated.pending.css, /data-cmsblock="demo"/);
        assert.equal(generated.published, null);

        const approved = (await request('/approve', 'POST')).data;
        assert.equal(approved.published.status, 'approved');
        assert.equal(approved.pending, null);
        assert.equal((await request('', 'GET')).data.published.revision, 1);

        const next = (await request('', 'PUT', {source: {format: 'text', content: 'Another headline'}, templateId: 'promotion'})).data;
        assert.equal(next.published.revision, 1);
        const regeneration = (await request('/generate', 'POST')).data;
        assert.equal(regeneration.pending.revision, 2);
        assert.equal(regeneration.published.revision, 1);
        await request('/reject', 'POST');
        const persisted = (await request('', 'GET')).data;
        assert.equal(persisted.pending, null);
        assert.equal(persisted.published.revision, 1);
    } finally {
        await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
        await rm(directory, {recursive: true, force: true});
    }
});

test('generated markup escapes authored HTML and allows only https images', async () => {
    const {generateBlock} = await import('../src/generator.mjs');
    const generated = generateBlock({
        source: {format: 'html', content: '<h2><img src="javascript:alert(1)">Hello</h2><img src="https://example.com/image.jpg" alt="nice">'},
        templateId: 'editorial',
    });
    assert.doesNotMatch(generated.html, /javascript:/i);
    assert.match(generated.html, /https:\/\/example.com\/image.jpg/);
    assert.match(generated.html, /Hello/);
});
