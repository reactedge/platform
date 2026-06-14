import { z } from 'zod';
import type {RawWidgetConfig} from "./Config.ts";

const CoordinateSchema = z.object({
    lat: z.number()
        .min(-90)
        .max(90),

    lng: z.number()
        .min(-180)
        .max(180)
}).strict();

const TranslationsSchema = z.record(
    z.string(),
    z.string()
);

const StoreSchema = z.object({
    name: z.string()
        .min(1)
        .max(80),

    lat: z.number()
        .min(-90)
        .max(90),

    lng: z.number()
        .min(-180)
        .max(180),

    hours: z.string()
        .min(1)
        .max(80)
}).strict();

export const WidgetConfigSchema = z.object({
    data: z.object({
        stores: z.array(StoreSchema)
            .min(1),

        defaultCenter: CoordinateSchema,

        zoom: z.number()
            .int()
            .min(1)
            .max(20),

        country: z.string()
            .regex(
                /^[a-z]{2}$/i,
                'Country must be a 2-letter ISO code'
            )

    }).strict(),

    integration: z.object({
        requires: z.array(
            z.enum([
                'googleMaps'
            ])
        ).min(1)
    }).strict(),

    translations: TranslationsSchema
        .optional()
}).strict();

export type WidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): RawWidgetConfig {
    return WidgetConfigSchema.parse(input);
}