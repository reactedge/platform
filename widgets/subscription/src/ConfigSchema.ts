import { z } from 'zod';

const IntegrationSchema = z.enum([
    "magentoGraphql"
]);

const WidgetDataSchema = z.object({
    title: z.string(),
    plans: z.array(z.object({
        id: z.string(),
        label: z.string(),
        frequency: z.string(),
        discount: z.string().optional(),
        termsBlockId: z.string().optional(),
    })),
    isCustomerLoggedIn: z.boolean(),
    loginUrl: z.string().url().optional(),
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
