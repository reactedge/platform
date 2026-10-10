import type {CmsBlockSource} from './types';

export type SourceStrategy = 'brief' | 'html-guardrail';

const structuralElements = new Set([
    'article', 'section', 'header', 'footer', 'main', 'aside',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'figure',
    'figcaption', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'td',
]);
const voidElements = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

/** Reject executable content. This is a preview safeguard, not a public SSR sanitizer. */
export function assertSafeMarkup(markup: string): void {
    if (/<\s*\/?\s*(script|style|iframe|object|embed|svg|math|form|base|link|meta|template)\b/i.test(markup) ||
        /\s(?:on[a-z]+|style|srcdoc|srcset)\s*=/i.test(markup) ||
        /\b(?:javascript|vbscript|data)\s*:/i.test(markup) ||
        /<\s*\/?\s*(?:html|head|body)\b/i.test(markup)) {
        throw new Error('Generated or authored HTML contains unsafe markup.');
    }
    for (const match of markup.matchAll(/\b(?:src|href)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
        const value = (match[1] ?? match[2] ?? match[3] ?? '').trim();
        if (!value || /[\u0000-\u001f]/.test(value) ||
            (match[0].toLowerCase().trimStart().startsWith('src') && !value.startsWith('https://')) ||
            (match[0].toLowerCase().trimStart().startsWith('href') &&
                !/^(https:\/\/|mailto:|#|\/(?!\/))/i.test(value))) {
            throw new Error('HTML contains an unsupported resource URL.');
        }
    }
}

function looksWellStructured(markup: string): boolean {
    const html = markup.replace(/<!--[\s\S]*?-->/g, '');
    const tokens = [...html.matchAll(/<\s*(\/?)\s*([a-z][\w-]*)\b[^>]*>/gi)];
    const stack: string[] = [];
    let semanticCount = 0;
    for (const token of tokens) {
        const tag = token[2]!.toLowerCase();
        if (token[1]) {
            if (stack.pop() !== tag) return false;
            continue;
        }
        if (structuralElements.has(tag)) semanticCount++;
        if (!voidElements.has(tag) && !token[0].endsWith('/>')) stack.push(tag);
    }
    return tokens.length > 0 && stack.length === 0 && semanticCount >= 2;
}

/**
 * Conservative heuristic: malformed/partial HTML is a creative brief.
 * Meaningful, balanced HTML is retained byte-for-byte as the structural guardrail.
 */
export function chooseSourceStrategy(source: CmsBlockSource): SourceStrategy {
    if (source.format !== 'html') return 'brief';
    try {
        assertSafeMarkup(source.content);
    } catch {
        return 'brief';
    }
    return looksWellStructured(source.content) ? 'html-guardrail' : 'brief';
}
