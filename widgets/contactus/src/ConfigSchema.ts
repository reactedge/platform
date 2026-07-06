import { z } from 'zod';

export const IntegrationNameSchema = z.enum([
    "cloudflare",
    "googleMaps",
    "magento",
    "intentApi"
]);

export const ContactCategorySchema = z.object({
    value: z.string(),
    label: z.string()
}).strict();

export const ContactFieldSchema = z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum([
        "text",
        "email",
        "textarea"
    ]).optional(),
    required: z.boolean()
}).strict();

export const WidgetDataConfigSchema = z.object({
    title: z.string(),
    intro: z.string(),
    endpoint: z.string().url(),

    categories: z.array(ContactCategorySchema),

    fields: z.array(ContactFieldSchema)
}).strict();

export const WidgetIntegrationsSchema = z.object({
    requires: z.array(IntegrationNameSchema)
}).strict();

export const WidgetConfigSchema = z.object({
    data: WidgetDataConfigSchema,

    integration: WidgetIntegrationsSchema.optional(),

    translations: z.record(
        z.string(),
        z.string()
    ).default({})
}).strict();

export type RawWidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): RawWidgetConfig {
    return WidgetConfigSchema.parse(input);
}