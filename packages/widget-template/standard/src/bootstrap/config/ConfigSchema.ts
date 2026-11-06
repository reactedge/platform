import { z } from 'zod';

const WidgetDataSchema = z.object({
    title: z.string(),
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