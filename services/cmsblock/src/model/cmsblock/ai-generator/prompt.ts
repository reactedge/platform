import {readFile} from 'node:fs/promises';
import type {SourceStrategy} from '../source-policy';

export const outputSchema = {
    type: 'object',
    properties: {css: {type: 'string'}},
    required: ['css'],
    additionalProperties: false,
} as const;

type PromptDocument = {version?: unknown; instructions?: unknown};
type PromptBuilderOptions = {
    version: string;
    url?: string;
    fetcher?: typeof fetch;
};

export class CmsBlockPromptBuilder {
    private instructionsPromise?: Promise<string>;

    constructor(private readonly options: PromptBuilderOptions) {
        if (!/^v[1-9][0-9]*$/.test(options.version)) {
            throw new Error('CMSBLOCK_PROMPT_VERSION must use the format v1, v2, and so on.');
        }
    }

    async buildInstructions(strategy: SourceStrategy): Promise<string> {
        const instructions = await (this.instructionsPromise ??= this.loadInstructions());
        const mode = strategy === 'html-guardrail'
            ? 'The author provided HTML. It is immutable; supply only CSS to style it.'
            : 'The author provided literal text. The server will render that exact text; supply only CSS.';
        return instructions + '\n' + mode;
    }

    private async loadInstructions(): Promise<string> {
        let source: string;
        if (this.options.url) {
            const response = await (this.options.fetcher ?? fetch)(
                this.options.url,
                {signal: AbortSignal.timeout(2_000)},
            );
            if (!response.ok) throw new Error('Failed to load CMSBlock prompt from CDN.');
            source = await response.text();
        } else {
            const asset = new URL(`../../../../cdn/cmsblock/prompt.${this.options.version}.json`, import.meta.url);
            source = await readFile(asset, 'utf8');
        }

        const prompt = JSON.parse(source) as PromptDocument;
        if (prompt.version !== this.options.version ||
            !Array.isArray(prompt.instructions) ||
            prompt.instructions.length === 0 ||
            !prompt.instructions.every(line => typeof line === 'string')) {
            throw new Error('CMSBlock prompt asset is invalid or its version does not match CMSBLOCK_PROMPT_VERSION.');
        }
        return prompt.instructions.join('\n');
    }
}
