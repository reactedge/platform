import {readFile, mkdir, rename, writeFile, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {generateBlock, validateDraft} from './generator.mjs';

export class CmsBlockStore {
    constructor(directory) {
        this.directory = directory;
        this.file = join(directory, 'demo.json');
        this.queue = Promise.resolve();
    }

    async get() {
        await this.queue;
        try {
            return JSON.parse(await readFile(this.file, 'utf8'));
        } catch (error) {
            if (error?.code === 'ENOENT') return null;
            throw error;
        }
    }

    async mutate(change) {
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

    save(input) {
        const draft = validateDraft(input);
        return this.mutate(current => ({
            id: 'demo',
            ...draft,
            revision: current?.revision ?? 0,
            pending: null,
            published: current?.published ?? null,
        }));
    }

    generate() {
        return this.mutate(current => {
            if (!current) throw new Error('Save the source content before generating.');
            const revision = current.revision + 1;
            return {
                ...current,
                revision,
                pending: {...generateBlock(current), revision, status: 'inreview'},
            };
        });
    }

    approve() {
        return this.mutate(current => {
            if (!current?.pending) throw new Error('Generate a draft before approving.');
            return {
                ...current,
                published: {...current.pending, status: 'approved'},
                pending: null,
            };
        });
    }

    reject() {
        return this.mutate(current => {
            if (!current?.pending) throw new Error('There is no draft to reject.');
            return {...current, pending: null};
        });
    }
}
