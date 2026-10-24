import { z } from 'zod';

const FeaturedCategorySchema = z.object({
    title: z.string().min(1),
    image: z.string().min(1),
    imageAlt: z.string().default(''),
    url: z.string().min(1),
}).strict();

export const WidgetConfigSchema = z.object({
    data: z.object({
        title: z.string().min(1),
        categories: z.array(FeaturedCategorySchema),
    }).strict(),
    settings: z.object({
        colour: z.string(),
    }).strict(),
}).strict();

export type WidgetConfig = z.infer<typeof WidgetConfigSchema>;

export function parseConfig(input: unknown): WidgetConfig {
    return WidgetConfigSchema.parse(input);
}
