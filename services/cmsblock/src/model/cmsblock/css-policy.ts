import {parse} from 'postcss';
import type {AtRule, Declaration, Rule} from 'postcss';

const SCOPE = '[data-cmsblock="demo"]';
const MAX_CSS_LENGTH = 25_000;
const DISALLOWED_PROPS = /^(?:display|position|float|clear|order|grid(?:-.*)?|flex(?:-.*)?|align(?:-.*)?|justify(?:-.*)?|place(?:-.*)?|width|min-width|max-width|height|min-height|max-height|aspect-ratio|object-fit|object-position|overflow(?:-.*)?|transform|translate|scale|rotate|text-transform|content|columns?|column-.*|top|left|right|bottom|inset(?:-.*)?)$/i;
const MEDIA_CONDITION = /^(?:(?:only\s+)?(?:screen|all)\s+and\s+)?\(\s*(?:(?:min|max)-width\s*:\s*\d+(?:\.\d+)?(?:px|em|rem)|prefers-reduced-motion\s*:\s*(?:reduce|no-preference))\s*\)$/i;

export class CmsBlockCssError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CmsBlockCssError';
    }
}

function validateSelector(selector: string): void {
    const trimmed = selector.trim();
    // The leading scope is mandatory. Avoid sibling combinators which
    // could reach outside the CMSBlock root.
    if (!trimmed.startsWith(SCOPE) || /[+~\\]/.test(trimmed) ||
        !/^(?:\[data-cmsblock="demo"\])(?:$|[\s.#[:>])/.test(trimmed)) {
        throw new CmsBlockCssError('AI CSS must be scoped to CMSBlock.');
    }
}

function validateDeclaration(declaration: Declaration): void {
    const name = declaration.prop.toLowerCase();
    if (DISALLOWED_PROPS.test(name)) return declaration.remove();
    const value = declaration.value;
    // Disallow active URLs, obfuscated escapes, and priority escalation.
    if (declaration.important || !name || !value ||
        /^(?:behavior|-moz-binding)$/i.test(name) ||
        /(?:url|image-set|expression)\s*\(/i.test(value) ||
        /[\\<>\u0000-\u0008\u000e-\u001f]/.test(value)) {
        throw new CmsBlockCssError('AI CSS contains unsupported declarations.');
    }
}

function validateRule(rule: Rule): void {
    if (!rule.selectors.length || !rule.nodes?.length) {
        throw new CmsBlockCssError('AI CSS contains an empty rule.');
    }
    for (const selector of rule.selectors) validateSelector(selector);
    let declarations = 0;
    rule.each(node => {
        if (node.type === 'comment') return;
        if (node.type !== 'decl') {
            throw new CmsBlockCssError('AI CSS contains unsupported nesting.');
        }
        validateDeclaration(node);
        declarations++;
    });
    if (!declarations) throw new CmsBlockCssError('AI CSS contains an empty rule.');
}

function validateMedia(media: AtRule): number {
    if (!MEDIA_CONDITION.test(media.params) || !media.nodes?.length) {
        throw new CmsBlockCssError('AI CSS contains unsupported media queries.');
    }
    let count = 0;
    media.each(node => {
        if (node.type === 'comment') return;
        if (node.type !== 'rule') {
            throw new CmsBlockCssError('AI CSS contains unsupported at-rules.');
        }
        validateRule(node);
        count++;
    });
    if (!count) throw new CmsBlockCssError('AI CSS contains empty media queries.');
    return count;
}

/**
 * Validate generated CSS against a restricted, CMSBlock-scoped dialect.
 * Allow flat rules and one level of responsive @media rules; refuse
 * @import, @font-face, keyframes, external assets and global selectors.
 *
 * This is a review-preview safeguard, not a public-facing CSS sanitizer.
 */
export function validateGeneratedCss(css: string): string {
    if (!css.trim() || css.length > MAX_CSS_LENGTH) {
        throw new CmsBlockCssError('AI returned empty or oversized CSS.');
    }
    let root;
    try {
        root = parse(css);
    } catch {
        throw new CmsBlockCssError('AI returned invalid CSS.');
    }
    let count = 0;
    root.each(node => {
        if (node.type === 'comment') return;
        if (node.type === 'rule') {
            validateRule(node);
            count++;
        } else if (node.type === 'atrule' && node.name.toLowerCase() === 'media') {
            count += validateMedia(node);
        } else {
            throw new CmsBlockCssError('AI CSS contains unsupported at-rules.');
        }
    });
    if (!count) throw new CmsBlockCssError('AI returned empty CSS.');
    return root.toString();
}
