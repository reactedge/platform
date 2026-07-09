import { z } from 'zod';

export const LatLngSchema = z.object({
    lat: z.number(),
    lng: z.number()
}).strict();

export const RegionMapDataConfigSchema = z.object({
    title: z.string().optional(),
    center: LatLngSchema,
    zoom: z.number().int().positive(),
    region: z.array(LatLngSchema)
}).strict();

export const WidgetConfigSchema = z.object({
    data: RegionMapDataConfigSchema,

    integration: z.object({
        requires: z.array(
            z.literal("googleMaps")
        )
    }).optional(),

    translations: z.record(
        z.string(),
        z.string()
    ).default({})
}).strict();

export type SchemaWidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): SchemaWidgetConfig {
    return WidgetConfigSchema.parse(input);
}