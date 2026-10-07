import type {Request, Response} from 'express';
import {z} from 'zod';
import type {ListingStore} from '../model/listing/listing-store';
import type {CloudinaryImageStore} from '../model/product/cloudinary-image-store';
import {ProductNotFoundError} from '../model/product/product-store';
import type {ProductStore} from '../model/product/product-store';
import {ProductInputSchema} from '../model/product/types';
import type {Operation} from '../observability/operation';

const invalidProductMessage = 'Enter valid product details.';

class ProductListingNotFoundError extends Error {
    constructor() {
        super('The listing no longer exists.');
    }
}

export class ProductHandler {
    list = async (_req: Request, res: Response): Promise<void> => {
        const operation = this.operation(res);
        try {
            const records = await this.store(res).list();
            operation.setAttribute('listingrecord.product_count', records.length);
            operation.succeed();
            res.json(records);
        } catch (error) {
            operation.fail(error);
            res.status(500).json({error: 'Unable to load saved products.'});
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const operation = this.operation(res);
        const input = ProductInputSchema.safeParse(req.body);
        if (!input.success) return this.invalid(res, operation, invalidProductMessage);

        try {
            await this.ensureListing(res, input.data.listingId);
            const record = await this.store(res).create(input.data);
            this.success(res, operation, record, 201);
        } catch (error) {
            this.failure(res, operation, error, 'Unable to save product.');
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const operation = this.operation(res);
        const id = this.productId(req, res, operation);
        if (!id) return;

        const input = ProductInputSchema.safeParse(req.body);
        if (!input.success) return this.invalid(res, operation, invalidProductMessage);

        try {
            await this.ensureListing(res, input.data.listingId);
            const record = await this.store(res).update(id, input.data);
            this.success(res, operation, record, 200);
        } catch (error) {
            this.failure(res, operation, error, 'Unable to save product.');
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const operation = this.operation(res);
        const id = this.productId(req, res, operation);
        if (!id) return;

        try {
            const product = await this.store(res).get(id);
            await this.imageStore(res).deleteMany(product.images.map(image => image.publicId));
            await this.store(res).delete(id);
            operation.setAttribute('listingrecord.product_id', id);
            operation.setAttribute('listingrecord.deleted_image_count', product.images.length);
            operation.succeed();
            res.status(204).end();
        } catch (error) {
            this.failure(res, operation, error, 'Unable to delete product.');
        }
    };

    private operation(res: Response): Operation {
        return res.locals.routeOperation as Operation;
    }

    private store(res: Response): ProductStore {
        return res.app.locals.products as ProductStore;
    }

    private imageStore(res: Response): CloudinaryImageStore {
        return res.app.locals.productImages as CloudinaryImageStore;
    }

    private productId(req: Request, res: Response, operation: Operation): string | undefined {
        const id = z.uuid().safeParse(req.params.id);
        if (id.success) return id.data;
        this.invalid(res, operation, 'Invalid product ID.');
        return undefined;
    }

    private invalid(res: Response, operation: Operation, message: string): void {
        operation.fail(new Error(message));
        res.status(400).json({error: message});
    }

    private async ensureListing(res: Response, listingId: string): Promise<void> {
        const listings = await (res.app.locals.listings as ListingStore).list();
        if (!listings.some(listing => listing.id === listingId)) throw new ProductListingNotFoundError();
    }

    private success(res: Response, operation: Operation, record: {id: string; listingId: string}, status: number): void {
        operation.setAttribute('listingrecord.product_id', record.id);
        operation.setAttribute('listingrecord.listing_id', record.listingId);
        operation.succeed();
        res.status(status).json(record);
    }

    private failure(res: Response, operation: Operation, error: unknown, fallback: string): void {
        operation.fail(error);
        const missing = error instanceof ProductNotFoundError || error instanceof ProductListingNotFoundError;
        res.status(missing ? 404 : 500).json({error: missing ? error.message : fallback});
    }
}
