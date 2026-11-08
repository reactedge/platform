import { z } from 'zod';

const FeaturedCardTypeSchema = z.enum([
    'category',
    'subcategory',
    'product',
    'cms',
    'external',
]);

const FeaturedCardSchema = z.object({
    type: FeaturedCardTypeSchema,
    title: z.string().min(1),
    link: z.string().min(1),
    thumbnail: z.string().min(1),
    altText: z.string().default(''),
}).strict();

const FeaturedBootstrapSchema = z.array(FeaturedCardSchema).min(1);

export const WidgetConfigSchema = z.object({
    data: z.object({
        title: z.string().min(1),
        cards: z.array(FeaturedCardSchema).optional().default([]),
    }).strict(),
    settings: z.object({
        colour: z.string(),
    }).strict(),
}).strict();

export type WidgetConfig = z.infer<typeof WidgetConfigSchema>;

export function parseConfig(input: unknown): WidgetConfig {
    return WidgetConfigSchema.parse(input);
}

export function parseBootstrap(input: unknown): WidgetConfig['data']['cards'] {
    return FeaturedBootstrapSchema.parse(input);
}
