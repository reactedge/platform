import { z } from 'zod';

const IntegrationSchema = z.enum([
    "magentoGraphql"
]);

const WidgetDataSchema = z.object({
    title: z.string().min(1),
    oneTimePurchaseLabel: z.string().min(1),
    subscriptionLabel: z.string().min(1),
    plansTitle: z.string().min(1),
    subscribeButtonLabel: z.string().min(1),
    plans: z.array(z.object({
        id: z.string().min(1),
        frequency: z.string().min(1),
        discount: z.string().min(1),
        termsUrl: z.string().min(1),
    }).strict()).min(1),
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
