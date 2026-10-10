import type {Application} from 'express';
import {setupStatusRoutes} from './status-router';
import {setupCmsBlockRoutes} from './cmsblock-router';

export default function setupRoutes(app: Application): void {
    setupStatusRoutes(app);
    setupCmsBlockRoutes(app);
}
