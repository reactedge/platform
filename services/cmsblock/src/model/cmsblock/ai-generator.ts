import type {CmsBlockDraft} from './types';
import {chooseSourceStrategy} from './source-policy';
import {outputSchema, CmsBlockPromptBuilder} from './ai-generator/prompt';
import {CmsBlockMarkupRenderer} from './ai-generator/markup';
import {CmsBlockLayoutCss} from './ai-generator/layout-css';
import {CmsBlockGenerationError, OpenAiResponseParser} from './ai-generator/response';

export type GeneratedMarkup = {html: string; css: string};
export type BlockGenerator = (draft: CmsBlockDraft) => Promise<GeneratedMarkup>;
type Fetcher = typeof fetch;
export {CmsBlockGenerationError};

const promptBuilder = new CmsBlockPromptBuilder();
const markupRenderer = new CmsBlockMarkupRenderer();
const layoutCss = new CmsBlockLayoutCss();
const responseParser = new OpenAiResponseParser();

export function createOpenAiGenerator(options: {
    apiKey: string;
    model: string;
    fetcher?: Fetcher;
}): BlockGenerator {
    const fetcher = options.fetcher ?? fetch;
    return async draft => {
        if (!options.apiKey) throw new CmsBlockGenerationError('OPENAI_API_KEY is required for AI generation.');
        const strategy = chooseSourceStrategy(draft.source);
        const html = markupRenderer.render(draft, strategy);
        const request = {
            model: options.model,
            store: false,
            input: [
                {role: 'developer', content: promptBuilder.buildInstructions(strategy)},
                {role: 'user', content: JSON.stringify({
                    authoredHtml: html, editorialStyle: draft.templateId,
                    imageLayout: draft.layoutId, strategy,
                })},
            ],
            text: {format: {type: 'json_schema', name: 'cmsblock_markup', strict: true, schema: outputSchema}},
            max_output_tokens: 6000,
        };
        let response: Response;
        try {
            response = await fetcher('https://api.openai.com/v1/responses', {
                method: 'POST',
                headers: {'Authorization': 'Bearer ' + options.apiKey, 'Content-Type': 'application/json'},
                body: JSON.stringify(request),
                signal: AbortSignal.timeout(45_000),
            });
        } catch {
            throw new CmsBlockGenerationError('AI generation request failed or timed out.');
        }
        const css = await responseParser.readCss(response);
        return {html, css: css + layoutCss.build(draft.layoutId, strategy)};
    };
}
