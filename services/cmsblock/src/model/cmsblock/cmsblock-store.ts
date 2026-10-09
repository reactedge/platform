import {readFile, mkdir, rename, writeFile, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {generateBlock, validateDraft} from './generator';
import {CmsBlockWorkflowError} from './errors';
import type {CmsBlockRecord, CmsBlockDraft} from './types';

export class CmsBlockStore {
    private readonly file: string;
    private queue: Promise<unknown> = Promise.resolve();

    constructor(private readonly directory: string) {
        this.directory = directory;
        this.file = join(directory, 'demo.json');
    }

    async get(): Promise<CmsBlockRecord | null> {
        await this.queue;
        try {
            return JSON.parse(await readFile(this.file, 'utf8')) as CmsBlockRecord;
        } catch (error) {
            if (error?.code === 'ENOENT') return null;
            throw error;
        }
    }

    private async mutate(change: (current: CmsBlockRecord | null) => CmsBlockRecord): Promise<CmsBlockRecord> {
        const task = this.queue.then(async () => {
            let current = null;
            try {
                current = JSON.parse(await readFile(this.file, 'utf8'));
            } catch (error) {
                if (error?.code !== 'ENOENT') throw error;
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

    generate(): Promise<CmsBlockRecord> {
        return this.mutate(current => {
            if (!current) throw new CmsBlockWorkflowError('Save the source content before generating.');
            const revision = current.revision + 1;
            return {
                ...current,
                revision,
                pending: {
                    ...generateBlock(current),
                    templateId: current.templateId,
                    layoutId: current.layoutId ?? ({editorial: 'image-above', feature: 'image-left', promotion: 'image-right'})[current.templateId],
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
