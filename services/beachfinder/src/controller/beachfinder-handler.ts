import type {Request, Response} from 'express';
import {BeachFinder, PostcodeNotFoundError, ProviderError} from '../model/beachfinder/beach-finder';
import type {Operation} from '../observability/operation';

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

export class BeachFinderHandler {
    constructor(private readonly finder = new BeachFinder()) {}

    search = async (request: Request, response: Response): Promise<void> => {
        const operation = response.locals.routeOperation as Operation;
        const query = parseBeachSearchQuery(request.query.postcode, request.query.radiusMiles);
        if (!query) {
            const error = new Error('Provide a valid UK postcode and radiusMiles from 0 to 100.');
            operation.fail(error);
            response.status(400).json({error: error.message});
            return;
        }

        try {
            const beaches = await this.finder.search(query.postcode, query.radiusMiles);
            operation.succeed();
            response.json({postcode: query.postcode.toUpperCase(), radiusMiles: query.radiusMiles, beaches});
        } catch (error) {
            if (error instanceof PostcodeNotFoundError) {
                operation.fail(error);
                response.status(404).json({error: 'UK postcode was not found.'});
                return;
            }
            if (error instanceof ProviderError) {
                operation.fail(error);
                response.status(502).json({error: error.message});
                return;
            }
            operation.fail(error);
            response.status(500).json({error: 'Beach search failed.'});
        }
    };
}
