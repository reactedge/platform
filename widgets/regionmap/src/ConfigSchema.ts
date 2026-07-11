import { z } from 'zod';

export const LatLngSchema = z.object({
    lat: z.number(),
    lng: z.number()
}).strict();

const MapPolygonSchema = z.tuple([
    LatLngSchema,
    LatLngSchema,
    LatLngSchema,
]).rest(LatLngSchema);


export const RegionMapDataConfigSchema = z.object({
    title: z.string().optional(),
    center: LatLngSchema,
    zoom: z.number().int().positive(),
    region: MapPolygonSchema
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

export function normalizeOptionalFields<
    T extends Record<string, unknown>,
    K extends keyof T
>(
    data: T,
    optionalFields: K[]
): Omit<T, K> {

    const result = { ...data };

    for (const field of optionalFields) {
        if (result[field] === undefined) {
            delete result[field];
        }
    }

    return result;
}