import { z } from "zod";

const CoordinateSchema = z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
}).strict();

export const WidgetConfigSchema = z.object({
    data: z.object({
        title: z.string().min(1).max(120),
        defaultCenter: CoordinateSchema,
        zoom: z.number().int().min(1).max(20).default(7),
        country: z.string().regex(/^[a-z]{2}$/i),
    }).strict(),
    integration: z.object({
        requires: z.array(z.enum(["googleMaps", "golfcoursesApi"])).min(1),
    }).strict(),
    translations: z.record(z.string(), z.string()).optional(),
}).strict();

export type SchemaWidgetConfig = z.infer<typeof WidgetConfigSchema>;

export function parseConfig(input: unknown): SchemaWidgetConfig {
    return WidgetConfigSchema.parse(input);
}
