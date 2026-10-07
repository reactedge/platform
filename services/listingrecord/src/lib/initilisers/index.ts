import {prepareStorageAccess} from "../../access/staticFile";
import {setupErrorHandler} from "../../error-handler";
import {ListingStore} from "../../model/listing/listing-store";
import {ProductStore} from "../../model/product/product-store";
import {CloudinaryImageStore} from "../../model/product/cloudinary-image-store";
import {config} from "../../config";
import type {Application} from "express";
import access from "../../access/index"
import routes from "../../routes/index.js";
import {setupTelemetry} from "../../observability/tracing";
import {createRequestOperationMiddleware} from "../../observability/request-operation-middleware";

export const initialiseApp = async (app: Application) => {
    const directory = await prepareStorageAccess();
    app.locals.storageDirectory = directory;
    app.locals.listings = new ListingStore(directory);
    app.locals.products = new ProductStore(directory);
    app.locals.productImages = new CloudinaryImageStore(config.cloudinary);
    setupTelemetry(app)
    app.use(createRequestOperationMiddleware('listingrecord.request'))
    access(app)
    routes(app)
    setupErrorHandler(app)
}
