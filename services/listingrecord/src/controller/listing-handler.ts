import type {Request, Response} from 'express';
import type {ListingStore} from '../model/listing/listing-store';
import {ListingInputSchema} from '../model/listing/types';
import type {Operation} from '../observability/operation';

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
            operation.fail(new Error('Invalid listing name.'));
            res.status(400).json({error: 'Enter a listing name between 1 and 50 characters.'});
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
}
