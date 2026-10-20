import type {Request, Response} from 'express';
import {z} from 'zod';
import {SearchError} from '../model/golf-course/golf-course-search';
import type {GolfCourseSearchResult} from '../model/golf-course/golf-course-search';
import type {Operation} from '../observability/operation';

const nearbyQuerySchema = z.object({
    postcode: z.string().trim().min(1, 'A UK postcode is required.'),
    radius_miles: z.coerce.number().positive().max(100).default(10),
});

export class GolfCourseHandler {
    nearby = async (req: Request, res: Response): Promise<void> => {
        const operation = res.locals.routeOperation as Operation;
        const input = nearbyQuerySchema.safeParse(req.query);
        if (!input.success) {
            const message = input.error.issues[0]?.message ?? 'Invalid search parameters.';
            operation.fail(new Error(message));
            res.status(400).json({error: message});
            return;
        }

        try {
            const searchGolfCourses = res.app.locals.searchGolfCourses as (
                postcode: string,
                radiusMiles: number,
            ) => Promise<GolfCourseSearchResult>;
            const result = await searchGolfCourses(input.data.postcode, input.data.radius_miles);
            operation.setAttribute('golfcourses.radius_miles', input.data.radius_miles);
            operation.setAttribute('golfcourses.result_count', result.courses.length);
            operation.succeed();
            res.json(result);
        } catch (error) {
            operation.fail(error);
            if (error instanceof SearchError) {
                res.status(error.statusCode).json({error: error.message});
                return;
            }
            res.status(500).json({error: 'Golf course search failed.'});
        }
    };
}
