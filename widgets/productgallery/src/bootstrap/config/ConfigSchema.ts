import { z } from 'zod';

const IntegrationSchema = z.enum([
    "magentoGraphql"
]);

export const GalleryModeSchema = z.enum([
    "tile",
    "gallery"
]);

export const ProductGalleryImageSchema = z.object({
    src: z.url(),
    alt: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
    role: z.enum([
        'base',
        'thumbnail',
        'hover',
        'gallery',
    ]).optional(),
});

const GallerySettingsSchema = z.discriminatedUnion("mode", [
    z.object({
        mode: z.literal("gallery"),
    }),
    z.object({
        mode: z.literal("tile"),
        maxColumns: z.number().int().min(1).max(2),
    }),
]);

export const WidgetConfigSchema = z.object({
    data: z.object({
        images: z.array(ProductGalleryImageSchema)
    }),
    settings: GallerySettingsSchema,
    integration: z.object({
        requires: z.array(IntegrationSchema)
    }).optional()
}).strict();

export type SchemaWidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): SchemaWidgetConfig {
    return WidgetConfigSchema.parse(input);
}