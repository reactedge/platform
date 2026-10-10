import {validateGeneratedCss} from '../css-policy';

export class CmsBlockGenerationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CmsBlockGenerationError';
    }
}

function extractOutputText(payload: unknown): string {
    if (typeof payload !== 'object' || !payload || !('output' in payload) ||
        !Array.isArray(payload.output)) {
        throw new CmsBlockGenerationError('AI returned an invalid response.');
    }
    for (const item of payload.output) {
        if (item?.type !== 'message' || !Array.isArray(item.content)) continue;
        for (const part of item.content) {
            if (part?.type === 'output_text' && typeof part.text === 'string') return part.text;
        }
    }
    throw new CmsBlockGenerationError('AI did not return a design.');
}

export async function readGeneratedCss(response: Response): Promise<string> {
    if (!response.ok) {
        let code: string | undefined;
        try {
            const payload: unknown = await response.json();
            if (payload && typeof payload === 'object' && 'error' in payload &&
                payload.error && typeof payload.error === 'object') {
                const error = payload.error as {code?: unknown; type?: unknown};
                const raw = typeof error.code === 'string' ? error.code :
                    typeof error.type === 'string' ? error.type : '';
                if (/^[a-z][a-z0-9_]{0,99}$/i.test(raw)) code = raw;
            }
        } catch { /* An error response may not contain JSON. */ }
        const detail = code ? ', ' + code : '';
        throw new CmsBlockGenerationError(
            'AI generation failed (HTTP ' + response.status + detail + ').'
        );
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(extractOutputText(await response.json()));
    } catch (error) {
        if (error instanceof CmsBlockGenerationError) throw error;
        throw new CmsBlockGenerationError('AI did not return valid JSON.');
    }
    if (typeof parsed !== 'object' || !parsed ||
        !('css' in parsed) || typeof parsed.css !== 'string') {
        throw new CmsBlockGenerationError('AI returned an incomplete design.');
    }
    return validateGeneratedCss(parsed.css);
}
