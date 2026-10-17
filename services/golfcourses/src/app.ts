import cors from 'cors';
import express, {type Application, type Request, type Response} from 'express';
import {z} from 'zod';
import {allowedOrigins, config} from './config';
import {
    findNearbyGolfCourses,
    SearchError,
    type GolfCourseSearchResult,
} from './golf-course-search';

const querySchema = z.object({
    postcode: z.string().trim().min(1, 'A UK postcode is required.'),
    radius_miles: z.coerce.number().positive().max(100).default(10),
});

type SearchFunction = (
    postcode: string,
    radiusMiles: number,
) => Promise<GolfCourseSearchResult>;

export function createApp(searchNearby: SearchFunction = findNearbyGolfCourses): Application {
    const app = express();
    app.disable('x-powered-by');
    app.use(cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'HEAD', 'OPTIONS'],
        allowedHeaders: ['Origin', 'Accept', 'Content-Type'],
    }));

    app.get(`${config.routePrefix}/status`, (_req: Request, res: Response) => {
        res.json({status: 'ok'});
    });

    app.get(`${config.routePrefix}/nearby`, async (req: Request, res: Response) => {
        const query = querySchema.safeParse(req.query);
        if (!query.success) {
            res.status(400).json({error: query.error.issues[0]?.message ?? 'Invalid search parameters.'});
            return;
        }
        try {
            res.json(await searchNearby(query.data.postcode, query.data.radius_miles));
        } catch (error) {
            const searchError = error instanceof SearchError
                ? error
                : new SearchError('Golf course search failed.', 500);
            res.status(searchError.statusCode).json({error: searchError.message});
        }
    });

    return app;
}
