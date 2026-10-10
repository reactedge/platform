import {parse} from 'postcss';
import {CmsBlockWorkflowError, CmsBlockValidationError} from '../errors';
import {assertSafeMarkup} from '../source-policy';
import type {CmsBlockRecord} from '../types';
import {CmsBlockPersistence} from './persistence';

type PendingRevisionInput = {html: string; css: string; revision: number};

function validatePendingRevision(input: unknown): PendingRevisionInput {
    if (!input || typeof input !== 'object') throw new CmsBlockValidationError('Invalid revision.');
    const data = input as Record<string, unknown>;
    if (typeof data.html !== 'string' || typeof data.css !== 'string' ||
        !Number.isInteger(data.revision) || !data.html.trim() ||
        data.html.length > 100_000 || !data.css.trim() || data.css.length > 25_000) {
        throw new CmsBlockValidationError('Invalid HTML, CSS or revision.');
    }
    try { assertSafeMarkup(data.html); }
    catch { throw new CmsBlockValidationError('Unsafe HTML.'); }
    let stylesheet: ReturnType<typeof parse>;
    try { stylesheet = parse(data.css); }
    catch { throw new CmsBlockValidationError('Invalid CSS.'); }
    let rules = 0;
    stylesheet.walk(node => {
        if (node.type === 'atrule' && node.name !== 'media')
            throw new CmsBlockValidationError('Unsupported CSS at-rule.');
        if (node.type === 'rule') {
            rules++;
            if (node.selectors.some(selector =>
                !selector.trim().startsWith('[data-cmsblock="demo"]') || /[+~\\\\]/.test(selector))) {
                throw new CmsBlockValidationError('CSS must stay scoped to CMSBlock.');
            }
        }
        if (node.type === 'decl' && (node.important || /url\\s*\\(|expression\\s*\\(|[<>]/i.test(node.value))) {
            throw new CmsBlockValidationError('Unsafe CSS declaration.');
        }
    });
    if (!rules) throw new CmsBlockValidationError('CSS contains no rules.');
    return {html: data.html, css: data.css, revision: data.revision as number};
}

export class CmsBlockRevisionStore {
    constructor(private readonly persistence: CmsBlockPersistence) {}

    updatePending(input: unknown): Promise<CmsBlockRecord> {
        const revision = validatePendingRevision(input);
        return this.persistence.mutate(current => {
            if (!current?.pending) throw new CmsBlockWorkflowError('No pending draft to edit.');
            if (current.pending.revision !== revision.revision)
                throw new CmsBlockWorkflowError('Draft changed. Reload before editing.');
            return {...current, pending: {...current.pending, html: revision.html, css: revision.css}};
        });
    }

    approve(): Promise<CmsBlockRecord> {
        return this.persistence.mutate(current => {
            if (!current?.pending) throw new CmsBlockWorkflowError('Generate a draft before approving.');
            return {...current, published: {...current.pending, status: 'approved'}, pending: null};
        });
    }

    reject(): Promise<CmsBlockRecord> {
        return this.persistence.mutate(current => {
            if (!current?.pending) throw new CmsBlockWorkflowError('There is no draft to reject.');
            return {...current, pending: null};
        });
    }
}
