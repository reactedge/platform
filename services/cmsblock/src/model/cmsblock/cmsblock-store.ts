import {readFile, mkdir, rename, writeFile, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {generateBlock, validateDraft} from './generator';
import {CmsBlockWorkflowError} from './errors';
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
