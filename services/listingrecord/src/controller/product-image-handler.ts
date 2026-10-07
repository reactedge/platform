import type {Request, Response} from 'express';
import {config} from '../config';
import {createCloudinarySignature} from '../lib/cloudinary-signature';
import type {Operation} from '../observability/operation';

export class ProductImageHandler {
    signature = (_req: Request, res: Response): void => {
        const operation = res.locals.routeOperation as Operation;
        const cloudinary = config.cloudinary;

        if (!cloudinary.cloudName || !cloudinary.apiKey || !cloudinary.apiSecret) {
            const error = new Error('Cloudinary is not configured.');
            operation.fail(error);
            res.status(503).json({error: error.message});
            return;
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const params = {timestamp, folder: cloudinary.folder};
        const signature = createCloudinarySignature(params, cloudinary.apiSecret);

        operation.succeed();
        res.json({
            cloudName: cloudinary.cloudName,
            apiKey: cloudinary.apiKey,
            timestamp,
            folder: cloudinary.folder,
            signature,
        });
    };
}
