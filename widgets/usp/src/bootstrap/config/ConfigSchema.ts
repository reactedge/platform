import { z } from 'zod';

export const WidgetConfigSchema = z.object({
    data: z.object({
        slides: z.array(
            z.object({
                heading: z.string().min(1).max(30).optional(),
                text: z.string().min(1).max(50)
            }).strict()
        ).min(1).max(3)
    }).strict(),

    settings: z.object({
        mode: z.object({
            desktop: z.enum(['static', 'slider']),
            tablet: z.enum(['static', 'slider']),
            mobile: z.enum(['static', 'slider'])
        }).strict(),

        theme: z.enum([
            'light',
            'dark',
            'promo'
        ]).default('light')
    }).strict()

}).strict();

export type WidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): WidgetConfig {
    return WidgetConfigSchema.parse(input);
}