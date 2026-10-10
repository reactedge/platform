import {readFile, mkdir, rename, writeFile, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {generateBlock, validateDraft} from './generator';
import {CmsBlockWorkflowError, CmsBlockValidationError} from './errors';
import {assertSafeMarkup} from './source-policy';
import {parse} from 'postcss';
import type {CmsBlockRecord, CmsBlockDraft} from './types';
import type {BlockGenerator} from './ai-generator';

export class CmsBlockStore {
    private readonly file: string;
    private queue: Promise<unknown> = Promise.resolve();

    constructor(private readonly directory: string, private readonly generator: BlockGenerator = async draft => generateBlock(draft)) {
        this.file = join(directory, 'demo.json');
    }

    async get(): Promise<CmsBlockRecord | null> {
        await this.queue;
        try {
            return JSON.parse(await readFile(this.file, 'utf8')) as CmsBlockRecord;
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
            throw error;
        }
    }

    private async mutate(change: (current: CmsBlockRecord | null) => CmsBlockRecord): Promise<CmsBlockRecord> {
        const task = this.queue.then(async () => {
            let current = null;
            try {
                current = JSON.parse(await readFile(this.file, 'utf8'));
            } catch (error) {
                if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
            }
            const next = change(current);
            await mkdir(this.directory, {recursive: true});
            const tmp = join(this.directory, `.demo-${randomUUID()}.tmp`);
            try {
                await writeFile(tmp, JSON.stringify(next, null, 2) + '\n', {flag: 'wx', mode: 0o600});
                await rename(tmp, this.file);
            } finally {
                await rm(tmp, {force: true});
            }
            return next;
        });
        this.queue = task.catch(() => undefined);
        return task;
    }

    save(input: unknown): Promise<CmsBlockRecord> {
        const draft: CmsBlockDraft = validateDraft(input);
        return this.mutate(current => ({
            id: 'demo',
            ...draft,
            revision: current?.revision ?? 0,
            pending: null,
            published: current?.published ?? null,
        }));
    }

    async generate(): Promise<CmsBlockRecord> {
        // Do not hold the persistence queue while calling a remote provider.
        const current = await this.get();
        if (!current) throw new CmsBlockWorkflowError('Save the source content before generating.');
        const draft = validateDraft(current);
        const expected = JSON.stringify({source: current.source, templateId: current.templateId, layoutId: draft.layoutId});
        const generated = await this.generator(draft);
        return this.mutate(latest => {
            if (!latest || JSON.stringify({
                source: latest.source, templateId: latest.templateId,
                layoutId: validateDraft(latest).layoutId,
            }) !== expected) {
                throw new CmsBlockWorkflowError('Source changed while generating. Save and generate again.');
            }
            const revision = latest.revision + 1;
            return {
                ...latest, revision,
                pending: {
                    ...generated,
                    templateId: draft.templateId, layoutId: draft.layoutId,
                    revision, status: 'inreview',
                },
            };
        });
    }

    updatePending(input: unknown): Promise<CmsBlockRecord> {
        if (!input || typeof input !== 'object') throw new CmsBlockValidationError('Invalid revision.');
        const data = input as Record<string, unknown>;
        if (typeof data.html !== 'string' || typeof data.css !== 'string' ||
            !Number.isInteger(data.revision) || !data.html.trim() ||
            data.html.length > 100_000 || !data.css.trim() || data.css.length > 25_000) {
            throw new CmsBlockValidationError('Invalid HTML, CSS or revision.');
        }
        try { assertSafeMarkup(data.html); }
        catch { throw new CmsBlockValidationError('Unsafe HTML.'); }
        // The manually edited CSS is allowed more freedom than AI-generated CSS.
        // Keep it scoped to the block and reject active URLs and imports.
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
                    !selector.trim().startsWith('[data-cmsblock="demo"]') ||
                    /[+~\\\\]/.test(selector))) {
                    throw new CmsBlockValidationError('CSS must stay scoped to CMSBlock.');
                }
            }
            if (node.type === 'decl' && (node.important ||
                /url\\s*\\(|expression\\s*\\(|[<>]/i.test(node.value))) {
                throw new CmsBlockValidationError('Unsafe CSS declaration.');
            }
        });
        if (!rules) throw new CmsBlockValidationError('CSS contains no rules.');
        return this.mutate(current => {
            if (!current?.pending) throw new CmsBlockWorkflowError('No pending draft to edit.');
            if (current.pending.revision !== data.revision)
                throw new CmsBlockWorkflowError('Draft changed. Reload before editing.');
            return {...current, pending: {...current.pending, html: data.html as string, css: data.css as string}};
        });
    }

    approve(): Promise<CmsBlockRecord> {
        return this.mutate(current => {
            if (!current?.pending) throw new CmsBlockWorkflowError('Generate a draft before approving.');
            return {
                ...current,
                published: {...current.pending, status: 'approved'},
                pending: null,
            };
        });
    }

    reject(): Promise<CmsBlockRecord> {
        return this.mutate(current => {
            if (!current?.pending) throw new CmsBlockWorkflowError('There is no draft to reject.');
            return {...current, pending: null};
        });
    }
}
