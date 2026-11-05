import { z } from "zod";

export const WidgetConfigSchema = z.object({
    data: z.object({
        sellers: z.array(
            z.object({
                id: z.string(),
                name: z.string().min(1),
                category: z.string(),
                lat: z.number(),
                lng: z.number(),
                description: z.string(),
                website: z.url(),
                rating: z.number().min(0).max(5)
            }).strict()
        ),

        defaultCenter: z.object({
            lat: z.number(),
            lng: z.number()
        }).strict(),

        zoom: z.number().int().positive(),

        country: z.string().length(2)
    }).strict(),

    integration: z.object({
        requires: z.array(z.enum(["googleMaps"]))
    }).strict()
}).strict();

export type SchemaWidgetConfig = z.infer<typeof WidgetConfigSchema>;

export function parseConfig(input: unknown): SchemaWidgetConfig {
    return WidgetConfigSchema.parse(input);
}