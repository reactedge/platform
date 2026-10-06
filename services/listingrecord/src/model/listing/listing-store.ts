import {constants} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {open, rename, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {ListingInputSchema, ListingsSchema} from './types';
import type {Listing} from './types';

export class ListingNotFoundError extends Error {
    constructor() { super("The listing no longer exists."); }
}

export class ListingStore {
    private readonly file: string;
    private pending: Promise<unknown> = Promise.resolve();

    constructor(directory: string) { this.file = path.join(directory, 'listings.json'); }

    private async read(): Promise<Listing[]> {
        try {
            const handle = await open(this.file, constants.O_RDONLY | constants.O_NOFOLLOW);
            try { return ListingsSchema.parse(JSON.parse(await handle.readFile('utf8'))); }
            finally { await handle.close(); }
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
            throw error;
        }
    }

    async list(): Promise<Listing[]> {
        await this.pending;
        return this.read();
    }

    private mutate<T>(change: (records: Listing[]) => T): Promise<T> {
        const mutation = this.pending.then(async () => {
            const records = await this.read();
            const result = change(records);
            const temporary = path.join(path.dirname(this.file), `.listings-${randomUUID()}.tmp`);
            try {
                await writeFile(temporary, `${JSON.stringify(records, null, 2)}\n`, {flag: 'wx', mode: 0o600});
                await rename(temporary, this.file);
            } finally { await rm(temporary, {force: true}); }
            return result;
        });
        this.pending = mutation.catch(() => undefined);
        return mutation;
    }

    create(input: unknown): Promise<Listing> {
        const data = ListingInputSchema.parse(input);
        return this.mutate(records => {
            const record = {id: randomUUID(), name: data.name};
            records.push(record);
            return record;
        });
    }

    update(id: string, input: unknown): Promise<Listing> {
        const data = ListingInputSchema.parse(input);
        return this.mutate(records => {
            const record = records.find(record => record.id === id);
            if (!record) throw new ListingNotFoundError();
            record.name = data.name;
            return record;
        });
    }

    delete(id: string): Promise<void> {
        return this.mutate(records => {
            const index = records.findIndex(record => record.id === id);
            if (index < 0) throw new ListingNotFoundError();
            records.splice(index, 1);
        });
    }
}
