import { z } from 'zod';

const WidgetDataSchema = z.object({
    title: z.string().min(1),
    image: z.object({
        src: z.string().min(1),
        alt: z.string().min(1),
    }).strict(),
});

const WidgetSettingsSchema = z.object({
    colour: z.string(),
});

export const WidgetConfigSchema = z.object({
    data: WidgetDataSchema,
    settings: WidgetSettingsSchema,
}).strict();

export type WidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): WidgetConfig {
    return WidgetConfigSchema.parse(input);
}