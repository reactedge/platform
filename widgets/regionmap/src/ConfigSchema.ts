import { z } from 'zod';

import type {RawWidgetConfig} from "./domain/regionmap.types.ts";

export const LatLngSchema = z.object({
    lat: z.number(),
    lng: z.number()
}).strict();

export const RegionMapDataConfigSchema = z.object({
    title: z.string(),
    center: LatLngSchema,
    zoom: z.number().int().positive(),
    region: z.array(LatLngSchema).min(3)
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

export type WidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): RawWidgetConfig {
    return WidgetConfigSchema.parse(input);
}