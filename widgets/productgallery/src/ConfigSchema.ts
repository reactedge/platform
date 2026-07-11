import { z } from 'zod';

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

export const WidgetConfigSchema = z.object({
    data: z.object({
        images: z.array(ProductGalleryImageSchema),
    }),
}).strict();

export type SchemaWidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): SchemaWidgetConfig {
    return WidgetConfigSchema.parse(input);
}