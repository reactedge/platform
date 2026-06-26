import { z } from 'zod';

export const WidgetConfigSchema = z.object({
    data: z.object({
        enabledCategories: z.array(z.string()),
        minProductCount: z.number().int().nonnegative(),

        attributeExcludedInLayer: z.array(z.string()),
        attributeOrder: z.array(z.string()),

        labelMap: z.record(
            z.string(),
            z.string()
        ),

        ai: z.object({
            enabled: z.boolean(),
            activationThreshold: z.number().int().nonnegative(),
            matchThreshold: z.number().int().nonnegative(),
            minIntentScore: z.number().int().nonnegative(),
            maxProductsForAnalysis: z.number().int().positive()
        })
    }),

    translations: z.record(
        z.string(),
        z.string()
    ).default({}).optional(),

    integrations: z.object({
        require: z.array(
            z.enum([
                'magentoGraphql',
                'intentApi'
            ])
        )
    })

}).strict();

export type RawWidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): RawWidgetConfig {
    return WidgetConfigSchema.parse(input);
}