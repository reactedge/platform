import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {CmsBlockStore} from '../src/model/cmsblock/cmsblock-store';
import {chooseSourceStrategy} from '../src/model/cmsblock/source-policy';
import {createOpenAiGenerator} from '../src/model/cmsblock/ai-generator';

const html = '<article><h2>Original title</h2><p>Actual description</p></article>';
const draft = (content: string, format: 'text' | 'html' = 'text') => ({
    source: {content, format}, templateId: 'editorial' as const,
    layoutId: 'image-left' as const,
});

const fake = (result: {html: string; css: string}) => async () =>
    new Response(JSON.stringify({output: [{
        type: 'message', content: [{type: 'output_text', text: JSON.stringify(result)}],
    }]}), {status: 200});

const css = '[data-cmsblock="demo"] h2 { font-size: 2rem; }';

test('classifies loose notes and malformed HTML as briefs, structured HTML as a guardrail', () => {
    assert.equal(chooseSourceStrategy(draft('Ideas for our gallery').source), 'brief');
    assert.equal(chooseSourceStrategy(draft('<h2>Unclosed heading<p>Body', 'html').source), 'brief');
    assert.equal(chooseSourceStrategy(draft(html, 'html').source), 'html-guardrail');
});

test('strong source HTML stays unchanged inside generated block', async () => {
    const gen = createOpenAiGenerator({
        apiKey: 'test', model: 'test-model',
        fetcher: fake({html: '<p>AI attempted to replace the content</p>', css}) as typeof fetch,
    });
    const result = await gen(draft(html, 'html'));
    assert.ok(result.html.includes(html));
    assert.ok(!result.html.includes('AI attempted'));
    assert.equal(result.css, css);
});

test('plain brief becomes structured HTML while retaining source metadata', async () => {
    let captured = '';
    const gen = createOpenAiGenerator({
        apiKey: 'test', model: 'test-model',
        fetcher: (async (_url, init) => {
            captured = String(init?.body);
            return fake({html: '<h2>Art gallery</h2><p>Explore new work</p>', css})();
        }) as typeof fetch,
    });
    const result = await gen(draft('Art gallery. Explore new work.'));
    assert.match(result.html, /<h2>Art gallery/);
    assert.match(captured, /"strategy":"brief"/);
    assert.match(captured, /"imageLayout":"image-left"/);
    assert.doesNotMatch(captured, /test-model.*Bearer/);
});

test('unsafe generated HTML and unscoped CSS are rejected', async () => {
    const markup = createOpenAiGenerator({
        apiKey: 'test', model: 'model',
        fetcher: fake({html: '<img src="x" onerror="alert(1)">', css}) as typeof fetch,
    });
    await assert.rejects(markup(draft('Art gallery')), /unsafe/i);
    const styles = createOpenAiGenerator({
        apiKey: 'test', model: 'model',
        fetcher: fake({html: '<p>Art gallery</p>', css: 'body {color:red}'}) as typeof fetch,
    });
    await assert.rejects(styles(draft('Art gallery')), /scoped/i);
});

test('failed generation leaves the approved revision untouched', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'cmsblock-ai-'));
    try {
        const store = new CmsBlockStore(dir, async () => {
            throw new Error('AI unavailable');
        });
        await store.save(draft('Content'));
        await assert.rejects(store.generate(), /AI unavailable/);
        const record = await store.get();
        assert.equal(record?.revision, 0);
        assert.equal(record?.pending, null);
    } finally {
        await rm(dir, {recursive: true, force: true});
    }
});

test('AI generation is rejected if a new source replaces the draft before completion', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'cmsblock-ai-'));
    try {
        let unblock!: () => void;
        const wait = new Promise<void>(resolve => { unblock = resolve; });
        let signalStarted!: () => void;
        const started = new Promise<void>(resolve => { signalStarted = resolve; });
        const store = new CmsBlockStore(dir, async () => {
            signalStarted();
            await wait;
            return {html: '<p>Old</p>', css};
        });
        await store.save(draft('Old source'));
        const pending = store.generate();
        // Ensure the generator has captured the old draft before saving a replacement.
        await started;
        await store.save(draft('New source'));
        unblock();
        await assert.rejects(pending, /Source changed/);
        const record = await store.get();
        assert.equal(record?.pending, null);
        assert.equal(record?.source.content, 'New source');
    } finally {
        await rm(dir, {recursive: true, force: true});
    }
});


test('provider 429 surfaces quota code without exposing its message', async () => {
    const gen = createOpenAiGenerator({
        apiKey: 'private-key', model: 'test-model',
        fetcher: (async () => new Response(JSON.stringify({
            error: {
                message: 'secret provider detail',
                code: 'credit_balance_exhausted',
                type: 'insufficient_quota',
            },
        }), {status: 429})) as typeof fetch,
    });
    await assert.rejects(gen(draft('An art gallery')), error => {
        assert.match(String(error), /429, credit_balance_exhausted/);
        assert.doesNotMatch(String(error), /secret provider detail|private-key/);
        return true;
    });
});
