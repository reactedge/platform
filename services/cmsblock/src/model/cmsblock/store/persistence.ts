import {readFile, mkdir, rename, writeFile, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import type {CmsBlockRecord} from '../types';

export class CmsBlockPersistence {
    private readonly file: string;
    private queue: Promise<unknown> = Promise.resolve();

    constructor(private readonly directory: string) {
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

    mutate(change: (current: CmsBlockRecord | null) => CmsBlockRecord): Promise<CmsBlockRecord> {
        const task = this.queue.then(async () => {
            let current: CmsBlockRecord | null = null;
            try {
                current = JSON.parse(await readFile(this.file, 'utf8')) as CmsBlockRecord;
            } catch (error) {
                if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
            }
            const next = change(current);
            await mkdir(this.directory, {recursive: true});
            const tmp = join(this.directory, '.demo-' + randomUUID() + '.tmp');
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
}
