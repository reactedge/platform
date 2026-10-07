import type {Request, Response} from 'express';
import type {ListingStore} from '../model/listing/listing-store';
import type {ProductStore} from '../model/product/product-store';
import {ProductInputSchema} from '../model/product/types';
import type {Operation} from '../observability/operation';

const invalidProductMessage = 'Enter valid product details.';

export class ProductHandler {
    list = async (_req: Request, res: Response): Promise<void> => {
        const operation = res.locals.routeOperation as Operation;
        try {
            const records = await (res.app.locals.products as ProductStore).list();
            operation.setAttribute('listingrecord.product_count', records.length);
            operation.succeed();
            res.json(records);
        } catch (error) {
            operation.fail(error);
            res.status(500).json({error: 'Unable to load saved products.'});
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const operation = res.locals.routeOperation as Operation;
        const input = ProductInputSchema.safeParse(req.body);
        if (!input.success) {
            operation.fail(new Error(invalidProductMessage));
            res.status(400).json({error: invalidProductMessage});
            return;
        }

        try {
            const listingExists = await this.listingExists(res, input.data.listingId);
            if (!listingExists) {
                operation.fail(new Error('The listing no longer exists.'));
                res.status(404).json({error: 'The listing no longer exists.'});
                return;
            }

            const record = await (res.app.locals.products as ProductStore).create(input.data);
            operation.setAttribute('listingrecord.product_id', record.id);
            operation.setAttribute('listingrecord.listing_id', record.listingId);
            operation.succeed();
            res.status(201).json(record);
        } catch (error) {
            operation.fail(error);
            res.status(500).json({error: 'Unable to save product.'});
        }
    };

    private async listingExists(res: Response, listingId: string): Promise<boolean> {
        const listings = await (res.app.locals.listings as ListingStore).list();
        return listings.some(listing => listing.id === listingId);
    }
}
