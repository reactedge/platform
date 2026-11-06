import { z } from 'zod';

const IntegrationSchema = z.string();

const WidgetDataSchema = z.object({
    title: z.string(),
});

const WidgetSettingsSchema = z.object({
    colour: z.string(),
});

export const WidgetConfigSchema = z.object({
    data: WidgetDataSchema,
    settings: WidgetSettingsSchema,
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