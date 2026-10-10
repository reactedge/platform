import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createOpenAiGenerator} from '../src/model/cmsblock/ai-generator';

const draft = {
    source: {content: 'A gallery', format: 'text' as const},
    templateId: 'editorial' as const,
    layoutId: 'image-left' as const,
    image: {src: 'https://example.com/gallery.jpg', alt: 'Gallery'},
};
const response = () => new Response(JSON.stringify({output: [{
    type: 'message',
    content: [{type: 'output_text', text: JSON.stringify({
        html: '<p>A gallery</p>',
        css: '[data-cmsblock="demo"] p { color: #123; }',
    })}],
}]}), {status: 200});

test('loads the selected versioned prompt asset from the CDN', async () => {
    let promptUrl = '';
    let requestBody: {input: Array<{role: string; content: string}>} | undefined;
    const generator = createOpenAiGenerator({
        apiKey: 'test',
        model: 'test-model',
        promptVersion: 'v1',
        promptUrl: 'https://cdn.example.com/cmsblock/prompt.v1.json',
        promptFetcher: (async url => {
            promptUrl = String(url);
            return new Response(JSON.stringify({
                version: 'v1',
                instructions: ['CDN prompt version v1'],
            }), {status: 200});
        }) as typeof fetch,
        fetcher: (async (_url, init) => {
            requestBody = JSON.parse(String(init?.body));
            return response();
        }) as typeof fetch,
    });

    await generator(draft);
    assert.equal(promptUrl, 'https://cdn.example.com/cmsblock/prompt.v1.json');
    assert.match(requestBody?.input.find(item => item.role === 'developer')?.content ?? '', /CDN prompt version v1/);
});

test('loads the default versioned prompt asset from the service CDN directory', async () => {
    let requestBody: {input: Array<{role: string; content: string}>} | undefined;
    const generator = createOpenAiGenerator({
        apiKey: 'test',
        model: 'test-model',
        fetcher: (async (_url, init) => {
            requestBody = JSON.parse(String(init?.body));
            return response();
        }) as typeof fetch,
    });

    await generator(draft);
    assert.match(requestBody?.input.find(item => item.role === 'developer')?.content ?? '', /You design an accessible, responsive CMS content block/);
});

test('rejects a CDN prompt whose version does not match configuration', async () => {
    let openAiCalled = false;
    const generator = createOpenAiGenerator({
        apiKey: 'test',
        model: 'test-model',
        promptVersion: 'v2',
        promptUrl: 'https://cdn.example.com/cmsblock/prompt.v1.json',
        promptFetcher: (async () => new Response(JSON.stringify({
            version: 'v1',
            instructions: ['Old prompt'],
        }), {status: 200})) as typeof fetch,
        fetcher: (async () => {
            openAiCalled = true;
            return response();
        }) as typeof fetch,
    });

    await assert.rejects(generator(draft), /version does not match/);
    assert.equal(openAiCalled, false);
});
