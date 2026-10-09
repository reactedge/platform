import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {once} from 'node:events';
import type {Server} from 'node:http';
import express from 'express';
import {CmsBlockStore} from '../src/model/cmsblock/cmsblock-store';
import {generateBlock, validateDraft} from '../src/model/cmsblock/generator';
import {setupCmsBlockRoutes} from '../src/routes/cmsblock-router';

test('legacy CMSBlock routes preserve the author -> review -> publish lifecycle', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'reactedge-cmsblock-'));
    const app = express();
    app.locals.cmsblocks = new CmsBlockStore(directory);
    // Route operation is a harmless test double; the production initializer sets up OTEL.
    app.use((req, res, next) => {
        res.locals.routeOperation = {succeed() {}, fail() {}, complete() {}};
        next();
    });
    app.use(express.json());
    // In production the same routes use the scaffolded OTEL middleware.
    const {setupCmsBlockRoutes} = await import('../src/routes/cmsblock-router');
    setupCmsBlockRoutes(app);
    // Tests provide dummy operations so routes can run without a collector.
    const server: Server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    try {
        const addr = server.address();
        assert.ok(addr && typeof addr !== 'string');
        const base = `http://127.0.0.1:${addr.port}/cmsblock/blocks/demo`;
        const request = async (suffix: string, method: string, body?: unknown) => {
            const response = await fetch(base + suffix, {
                method, headers: {'Content-Type': 'application/json'},
                ...(body === undefined ? {} : {body: JSON.stringify(body)}),
            });
            return {status: response.status, data: await response.json()};
        };
        assert.equal((await request('', 'GET')).status, 404);
        const draft = {
            source: {format: 'html', content: '<h2>Welcome</h2><p>Our collection</p><img src="https://example.com/art.jpg" alt="Art">'},
            templateId: 'editorial', layoutId: 'image-right',
        };
        const saved = await request('', 'PUT', draft);
        assert.equal(saved.status, 200);
        assert.equal(saved.data.layoutId, 'image-right');

        const review = await request('/generate', 'POST');
        assert.equal(review.status, 200);
        assert.equal(review.data.pending.status, 'inreview');
        assert.match(review.data.pending.html, /cmsblock-layout--image-right/);
        assert.equal(review.data.published, null);

        const approved = await request('/approve', 'POST');
        assert.equal(approved.data.published.revision, 1);
        assert.equal(approved.data.pending, null);
        const newer = await request('', 'PUT', {...draft, layoutId: 'image-left'});
        assert.equal(newer.data.published.revision, 1);
        const refreshed = await request('/generate', 'POST');
        assert.equal(refreshed.data.pending.revision, 2);
        assert.match(refreshed.data.pending.html, /cmsblock-layout--image-left/);
        assert.equal(refreshed.data.published.revision, 1);
        const rejected = await request('/reject', 'POST');
        assert.equal(rejected.data.pending, null);
        assert.equal((await request('', 'GET')).data.published.revision, 1);

        assert.equal((await request('', 'PUT', {source: {format: 'text', content: ''}, templateId: 'feature'})).status, 400);
    } finally {
        await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
        await rm(directory, {recursive: true, force: true});
    }
});

test('legacy validation, HTML escaping and style-layout combinations', () => {
    const source = {format: 'html' as const,
        content: '<h2>Hello</h2><p>Text</p><script>alert(1)</script><img src="https://example.com/photo.jpg" alt="Art">'};
    const left = generateBlock({source, templateId: 'promotion', layoutId: 'image-left'});
    assert.match(left.html, /cmsblock-layout--image-left/);
    assert.match(left.html, /https:\/\/example.com\/photo.jpg/);
    assert.doesNotMatch(left.html, /<script/i);
    assert.equal(validateDraft({source, templateId: 'feature'}).layoutId, 'image-left');
    assert.throws(() => validateDraft({source, templateId: 'feature', layoutId: 'wrong'}));
});
