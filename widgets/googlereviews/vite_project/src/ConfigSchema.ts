import { z } from 'zod';

export const WidgetConfigSchema = z.object({
    data: z.object({
        country: z.string().min(2).max(2),
        title: z.string().min(1)
    }),
    integration: z.object({
        requires: z.array(z.literal('googleMaps'))
    })
}).strict();

export type WidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): WidgetConfig {
    return WidgetConfigSchema.parse(input);
}