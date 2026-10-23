import { z } from 'zod';

const IntegrationSchema = z.enum([
    "magentoGraphql"
]);

const WidgetDataSchema = z.object({
    title: z.string().min(1),
}).strict();

const WidgetSettingsSchema = z.object({
    colour: z.string().min(1),
}).strict();

export const WidgetConfigSchema = z.object({
    data: WidgetDataSchema,
    settings: WidgetSettingsSchema,
    integration: z.object({
        requires: z.array(IntegrationSchema).default(["magentoGraphql"])
    }).strict()
}).strict();

export type SchemaWidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): SchemaWidgetConfig {
    return WidgetConfigSchema.parse(input);
}
