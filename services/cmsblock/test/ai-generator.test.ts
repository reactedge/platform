import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {CmsBlockStore} from '../src/model/cmsblock/cmsblock-store';
import {chooseSourceStrategy} from '../src/model/cmsblock/source-policy';
import {createOpenAiGenerator} from '../src/model/cmsblock/ai-generator';
import {validateGeneratedCss} from '../src/model/cmsblock/css-policy';

const html = '<article><h2>Original title</h2><p>Actual description</p></article>';
const draft = (content: string, format: 'text' | 'html' = 'text') => ({
    source: {content, format}, templateId: 'editorial' as const,
    layoutId: 'image-left' as const,
    image: {src: 'https://example.com/supplied.jpg', alt: 'Supplied image'},
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
    assert.match(result.css, /white-space: pre-wrap/);
});

test('plain brief retains literal text and includes selected presentation metadata', async () => {
    let captured = '';
    const gen = createOpenAiGenerator({
        apiKey: 'test', model: 'test-model',
        fetcher: (async (_url, init) => {
            captured = String(init?.body);
            return fake({html: '<h2>Art gallery</h2><p>Explore new work</p>', css})();
        }) as typeof fetch,
    });
    const result = await gen(draft('Art gallery. Explore new work.'));
    assert.match(result.html, /Art gallery\. Explore new work\./);
    assert.match(captured, /"strategy":"brief"/);
    assert.match(captured, /"imageLayout":"image-left"/);
    assert.doesNotMatch(captured, /test-model.*Bearer/);
});

test('AI HTML is ignored and unscoped CSS is rejected', async () => {
    const markup = createOpenAiGenerator({
        apiKey: 'test', model: 'model',
        fetcher: fake({html: '<img src="x" onerror="alert(1)">', css}) as typeof fetch,
    });
    const safe = await markup(draft('Art gallery'));
    assert.doesNotMatch(safe.html, /onerror|src="x"/i);
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

test('accepts scoped responsive media queries in generated AI designs', async () => {
    const responsiveCss = [
        '[data-cmsblock="demo"] { display: grid; grid-template-columns: 1fr 1fr; }',
        '@media (max-width: 768px) {',
        '  [data-cmsblock="demo"] { grid-template-columns: 1fr; }',
        '  [data-cmsblock="demo"] h2 { font-size: clamp(1.25rem, 4vw, 2rem); }',
        '}',
    ].join('\n');
    const generator = createOpenAiGenerator({
        apiKey: 'test', model: 'test-model',
        fetcher: fake({html: '<h2>Gallery</h2>', css: responsiveCss}) as typeof fetch,
    });
    assert.ok((await generator(draft('A gallery'))).css.startsWith(responsiveCss));
});

test('rejects unsafe CSS while allowing scoped responsive rules', () => {
    const dangerous = [
        '@import url("https://example.com/tracker.css");',
        '@media (max-width: 768px) { body {color:red} }',
        '@font-face { font-family: custom; src: url("https://example.com/font"); }',
        '[data-cmsblock="demo"] ~ body { display:none; }',
        '[data-cmsblock="demo"] { background-image: url("https://example.com/x"); }',
        '@media print { [data-cmsblock="demo"] { display:none; } }',
        '[data-cmsblock="demo"] { color:red; ',
    ];
    for (const css of dangerous) {
        assert.throws(() => validateGeneratedCss(css), /AI CSS|AI returned/);
    }
    assert.equal(validateGeneratedCss(
        '@media screen and (max-width: 45rem) { [data-cmsblock="demo"] { gap: 1rem; } }',
    ).includes('@media'), true);
});

test('AI cannot rewrite user copy even when it returns extra HTML', async () => {
    const gen = createOpenAiGenerator({
        apiKey: 'test', model: 'test-model',
        fetcher: fake({html: '<h2>Invented headline</h2><img src="https://example.com/new.jpg">', css}) as typeof fetch,
    });
    const text = 'Exactly these words & symbols.\nSecond line exactly.';
    const result = await gen(draft(text));
    assert.match(result.html, /Exactly these words &amp; symbols\./);
    assert.match(result.html, /Second line exactly\./);
    assert.doesNotMatch(result.html, /Invented headline|new\.jpg/);
});

test('missing image is allowed and AI cannot invent one', async () => {
    const generator = createOpenAiGenerator({
        apiKey: 'test', model: 'test-model',
        fetcher: fake({html: '<img src="https://example.com/invented.jpg">', css}) as typeof fetch,
    });
    const input = {...draft('Literal source'), image: undefined};
    const result = await generator(input);
    assert.match(result.html, /Literal source/);
    assert.doesNotMatch(result.html, /<img|invented\.jpg/);
});

test('existing HTML image needs no separate image field', async () => {
    const authored = '<article><h2>Artwork</h2><p>Original painting</p><img src="https://example.com/photo.jpg" alt="Painting"></article>';
    const generator = createOpenAiGenerator({
        apiKey: 'test', model: 'test-model',
        fetcher: fake({html: '<h2>Changed</h2>', css}) as typeof fetch,
    });
    const result = await generator({...draft(authored, 'html'), image: undefined});
    assert.ok(result.html.includes(authored));
    assert.doesNotMatch(result.html, /<h2>Changed<\/h2>/);
});

test('AI cannot override image proportions or position', async () => {
    const dangerous = '[data-cmsblock="demo"] { display: flex; grid-template-columns: 4fr 1fr; }' +
        '[data-cmsblock="demo"] img { width: 100%; height: 160px; object-fit: cover; }';
    const gen = createOpenAiGenerator({
        apiKey: 'test', model: 'test-model',
        fetcher: fake({html: '', css: dangerous}) as typeof fetch,
    });
    const result = await gen(draft('My exact copy'));
    assert.doesNotMatch(result.css, /height: 160px|object-fit: cover|4fr 1fr/);
    assert.match(result.css, /object-fit: contain/);
    assert.match(result.css, /grid-column: 1/);
});
