import { z } from 'zod';

const TranslationsSchema = z.record(
    z.string(),
    z.string()
);

export const WidgetConfigSchema = z.object({
    data: z.object({
        country: z.string().min(2).max(2),
        title: z.string().min(1)
    }),
    integration: z.object({
        requires: z.array(z.literal('googleMaps'))
    }),
    translations: TranslationsSchema
        .optional()
}).strict();

export type SchemaWidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): SchemaWidgetConfig {
    return WidgetConfigSchema.parse(input);
}