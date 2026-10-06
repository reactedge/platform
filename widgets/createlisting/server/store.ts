import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { ListingInputSchema, ListingsSchema, type Listing } from '../src/models/listing.ts';

export class ListingNotFoundError extends Error {}

/** One store per file/process. Serialize mutations and replace the JSON file atomically. */
export class ListingStore {
    private pending: Promise<unknown> = Promise.resolve();
    private readonly file: string;
    constructor(file: string) { this.file = file; }

    async list(): Promise<Listing[]> {
        await this.pending;
        return this.read();
    }

    private async read(): Promise<Listing[]> {
        try {
            const parsed = ListingsSchema.safeParse(JSON.parse(await readFile(this.file, 'utf8')));
            if (!parsed.success) throw new Error('Invalid listing storage.');
            return parsed.data;
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
            throw error;
        }
    }

    private mutate<T>(operation: (records: Listing[]) => T): Promise<T> {
        const result = this.pending.then(async () => {
            const records = await this.read();
            const value = operation(records);
            await mkdir(dirname(this.file), { recursive: true });
            const temporary = `${this.file}.${randomUUID()}.tmp`;
            try {
                await writeFile(temporary, `${JSON.stringify(records, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
                await rename(temporary, this.file);
            } finally {
                await rm(temporary, { force: true });
            }
            return value;
        });
        this.pending = result.catch(() => undefined);
        return result;
    }

    create(input: unknown): Promise<Listing> {
        const data = ListingInputSchema.parse(input);
        return this.mutate(records => {
            const record = { id: randomUUID(), ...data };
            records.push(record);
            return record;
        });
    }

    update(id: string, input: unknown): Promise<Listing> {
        const data = ListingInputSchema.parse(input);
        return this.mutate(records => {
            const record = records.find(record => record.id === id);
            if (!record) throw new ListingNotFoundError('Listing not found.');
            record.name = data.name;
            return record;
        });
    }

    delete(id: string): Promise<void> {
        return this.mutate(records => {
            const index = records.findIndex(record => record.id === id);
            if (index < 0) throw new ListingNotFoundError('Listing not found.');
            records.splice(index, 1);
        });
    }
}
