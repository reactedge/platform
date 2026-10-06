import { z } from 'zod';

export const WidgetConfigSchema = z.object({
    data: z.object({ title: z.string() }),
    settings: z.object({
        colour: z.string(),
        listingsApi: z.string().refine(value => value.startsWith('/') && !value.startsWith('//'),
            'Listing API must be a same-origin path.').default('/api/listings'),
    }),
}).strict();

export type SchemaWidgetConfig = z.infer<typeof WidgetConfigSchema>;
export function parseConfig(input: unknown): SchemaWidgetConfig { return WidgetConfigSchema.parse(input); }
