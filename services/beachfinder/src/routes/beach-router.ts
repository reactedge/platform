import type {Application, Request, Response} from 'express';
import express from 'express';
import {config} from '../config';
import {BeachFinder, PostcodeNotFoundError, ProviderError} from '../model/beachfinder';
import {createRouteOperationMiddleware} from '../observability/request-operation-middleware';

const postcodePattern = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

export function parseBeachSearchQuery(postcodeValue: unknown, radiusValue: unknown): {
    postcode: string;
    radiusMiles: number;
} | null {
    const postcode = String(postcodeValue ?? '').trim();
    const radiusMiles = Number(radiusValue);
    if (!postcodePattern.test(postcode) || !Number.isFinite(radiusMiles) || radiusMiles <= 0 || radiusMiles > 100) {
        return null;
    }
    return {postcode, radiusMiles};
}

export function setupBeachRoutes(app: Application, finder = new BeachFinder()): void {
    const router = express.Router();
    router.get(
        '/beaches',
        createRouteOperationMiddleware('beachfinder.search'),
        async (request: Request, response: Response) => handleBeachSearch(request, response, finder)
    );
    app.use(config.route.servicePrefix, router);
}

async function handleBeachSearch(
    request: Request,
    response: Response,
    finder: BeachFinder
): Promise<void> {
    const query = parseBeachSearchQuery(request.query.postcode, request.query.radiusMiles);
    if (!query) {
        response.status(400).json({error: 'Provide a valid UK postcode and radiusMiles from 0 to 100.'});
        return;
    }
    try {
        const beaches = await finder.search(query.postcode, query.radiusMiles);
        response.json({postcode: query.postcode.toUpperCase(), radiusMiles: query.radiusMiles, beaches});
    } catch (error) {
        if (error instanceof PostcodeNotFoundError) {
            response.status(404).json({error: 'UK postcode was not found.'});
            return;
        }
        if (error instanceof ProviderError) {
            response.status(502).json({error: error.message});
            return;
        }
        response.status(500).json({error: 'Beach search failed.'});
    }
}
