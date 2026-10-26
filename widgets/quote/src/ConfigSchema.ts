import { z } from 'zod';

const IntegrationSchema = z.enum([
    "magentoGraphql",
    "intentApi"
]);

const WidgetDataSchema = z.object({
    title: z.string(),
});

const WidgetSettingsSchema = z.object({
    colour: z.string(),
    countryCode: z.string().trim().regex(/^[A-Za-z]{2}$/).transform(value => value.toUpperCase()).default("GB"),
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
