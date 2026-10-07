import type {Request, Response} from 'express';
import {z} from 'zod';
import {ListingNotFoundError} from '../model/listing/listing-store';
import type {ListingStore} from '../model/listing/listing-store';
import {ListingInputSchema} from '../model/listing/types';
import type {ProductStore} from '../model/product/product-store';
import type {Operation} from '../observability/operation';

class ListingHasProductsError extends Error {
    constructor(count: number) {
        super(`Delete the ${count} ${count === 1 ? 'product' : 'products'} assigned to this listing before deleting it.`);
    }
}

export class ListingHandler {
    list = async (_req: Request, res: Response): Promise<void> => {
        const operation = res.locals.routeOperation as Operation;
        try {
            const records = await (res.app.locals.listings as ListingStore).list();
            operation.setAttribute('listingrecord.record_count', records.length);
            operation.succeed();
            res.json(records);
        } catch (error) {
            operation.fail(error);
            res.status(500).json({error: 'Unable to load saved listings.'});
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const operation = res.locals.routeOperation as Operation;
        const input = ListingInputSchema.safeParse(req.body);
        if (!input.success) {
            this.invalidInput(res, operation, input.error);
            return;
        }

        try {
            const record = await (res.app.locals.listings as ListingStore).create(input.data);
            operation.setAttribute('listingrecord.record_id', record.id);
            operation.succeed();
            res.status(201).json(record);
        } catch (error) {
            operation.fail(error);
            res.status(500).json({error: 'Unable to save listing.'});
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        await this.modify(req, res, false);
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        await this.modify(req, res, true);
    };

    private async modify(req: Request, res: Response, deleting: boolean): Promise<void> {
        const operation = res.locals.routeOperation as Operation;
        const id = z.uuid().safeParse(req.params.id);

        if (!id.success) {
            this.invalid(res, operation, 'Invalid listing ID.');
            return;
        }

        const input = deleting ? null : ListingInputSchema.safeParse(req.body);
        if (input && !input.success) {
            this.invalidInput(res, operation, input.error);
            return;
        }

        try {
            const store = res.app.locals.listings as ListingStore;
            if (deleting) await this.ensureNoProducts(res, id.data);
            const record = deleting
                ? await store.delete(id.data)
                : await store.update(id.data, input!.data);

            operation.setAttribute('listingrecord.record_id', id.data);
            operation.succeed();

            if (deleting) res.status(204).end();
            else res.json(record);
        } catch (error) {
            operation.fail(error);
            const missing = error instanceof ListingNotFoundError;
            const inUse = error instanceof ListingHasProductsError;
            const status = missing ? 404 : inUse ? 409 : 500;
            const message = missing || inUse
                ? error.message
                : deleting ? 'Unable to delete listing.' : 'Unable to save listing.';
            res.status(status).json({error: message});
        }
    }

    private invalidInput(res: Response, operation: Operation, error: z.ZodError): void {
        const statusInvalid = error.issues.some(issue => issue.path[0] === 'status');
        const message = statusInvalid
            ? 'Choose a valid listing status.'
            : 'Enter a listing name between 1 and 50 characters.';
        this.invalid(res, operation, message);
    }

    private invalid(res: Response, operation: Operation, message: string): void {
        operation.fail(new Error(message));
        res.status(400).json({error: message});
    }

    private async ensureNoProducts(res: Response, listingId: string): Promise<void> {
        const products = await (res.app.locals.products as ProductStore).list();
        const count = products.filter(product => product.listingId === listingId).length;
        if (count > 0) throw new ListingHasProductsError(count);
    }
}
