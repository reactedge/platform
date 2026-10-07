import {constants} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {open, rename, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {ProductInputSchema, ProductsSchema} from './types';
import type {Product} from './types';

export class ProductNotFoundError extends Error {
    constructor() {
        super('The product no longer exists.');
    }
}

export class ProductStore {
    private readonly file: string;
    private pending: Promise<unknown> = Promise.resolve();

    constructor(directory: string) {
        this.file = path.join(directory, 'products.json');
    }

    private async read(): Promise<Product[]> {
        try {
            const handle = await open(this.file, constants.O_RDONLY | constants.O_NOFOLLOW);
            try {
                return ProductsSchema.parse(JSON.parse(await handle.readFile('utf8')));
            } finally {
                await handle.close();
            }
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
            throw error;
        }
    }

    async list(): Promise<Product[]> {
        await this.pending;
        return this.read();
    }

    async get(id: string): Promise<Product> {
        await this.pending;
        const record = (await this.read()).find(product => product.id === id);
        if (!record) throw new ProductNotFoundError();
        return record;
    }

    create(input: unknown): Promise<Product> {
        const data = ProductInputSchema.parse(input);
        return this.mutate(records => {
            const record = {id: randomUUID(), ...data};
            records.push(record);
            return record;
        });
    }

    update(id: string, input: unknown): Promise<Product> {
        const data = ProductInputSchema.parse(input);
        return this.mutate(records => {
            const record = records.find(product => product.id === id);
            if (!record) throw new ProductNotFoundError();
            Object.assign(record, data);
            return record;
        });
    }

    delete(id: string): Promise<void> {
        return this.mutate(records => {
            const index = records.findIndex(product => product.id === id);
            if (index < 0) throw new ProductNotFoundError();
            records.splice(index, 1);
        });
    }

    private mutate<T>(change: (records: Product[]) => T): Promise<T> {
        const mutation = this.pending.then(async () => {
            const records = await this.read();
            const result = change(records);
            await this.write(records);
            return result;
        });
        this.pending = mutation.catch(() => undefined);
        return mutation;
    }

    private async write(records: Product[]): Promise<void> {
        const temporary = path.join(path.dirname(this.file), `.products-${randomUUID()}.tmp`);
        try {
            await writeFile(temporary, `${JSON.stringify(records, null, 2)}\n`, {flag: 'wx', mode: 0o600});
            await rename(temporary, this.file);
        } finally {
            await rm(temporary, {force: true});
        }
    }
}
