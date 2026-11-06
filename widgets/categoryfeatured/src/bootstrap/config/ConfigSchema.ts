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
    altText: z.string().min(1),
}).strict();

const LegacyFeaturedCategorySchema = z.object({
    title: z.string().min(1),
    image: z.string().min(1),
    imageAlt: z.string().default(''),
    url: z.string().min(1),
}).strict();

const FeaturedDataSchema = z.object({
    title: z.string().min(1),
    cards: z.array(FeaturedCardSchema),
}).strict();

const FeaturedBootstrapSchema = z.array(FeaturedCardSchema);

export const WidgetConfigSchema = z.object({
    data: z.preprocess((input) => {
        if (typeof input !== 'object' || input === null || Array.isArray(input)) {
            return input;
        }

        const legacy = input as { title?: unknown; categories?: unknown };
        if (!Array.isArray(legacy.categories)) return input;

        const categories = z.array(LegacyFeaturedCategorySchema).parse(legacy.categories);
        return {
            title: legacy.title,
            cards: categories.map((category) => ({
                type: 'category' as const,
                title: category.title,
                link: category.url,
                thumbnail: category.image,
                altText: category.imageAlt || category.title,
            })),
        };
    }, FeaturedDataSchema),
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
