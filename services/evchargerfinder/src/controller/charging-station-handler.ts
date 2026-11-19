import type {Request, Response} from 'express';
import {z} from 'zod';
import {SearchError} from '../model/charging-station-search';
import type {ChargingStationSearchResult} from '../model/charging-station-search';
import type {Operation} from '../observability/operation';

const querySchema = z.object({
    postcode: z.string().trim().min(1, 'A UK postcode is required.').max(12),
    radiusKm: z.enum(['5', '10', '25', '50']).transform(Number),
});

export class ChargingStationHandler {
    nearby = async (req: Request, res: Response): Promise<void> => {
        const operation = res.locals.routeOperation as Operation;
        const parsed = querySchema.safeParse(req.query);
        if (!parsed.success) {
            const message = parsed.error.issues[0]?.message ?? 'Invalid search parameters.';
            operation.fail(new Error(message));
            res.status(400).json({error: message});
            return;
        }

        try {
            const search = res.app.locals.searchChargers as (
                postcode: string,
                radiusKm: number,
            ) => Promise<ChargingStationSearchResult>;
            const result = await search(parsed.data.postcode, parsed.data.radiusKm);
            operation.setAttribute('evchargers.radius_km', parsed.data.radiusKm);
            operation.setAttribute('evchargers.result_count', result.stations.length);
            operation.succeed();
            res.json(result);
        } catch (error) {
            operation.fail(error);
            if (error instanceof SearchError) {
                res.status(error.statusCode).json({error: error.message});
                return;
            }
            res.status(500).json({error: 'Charging station search failed.'});
        }
    };
}
