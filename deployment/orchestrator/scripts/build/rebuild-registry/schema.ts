import { z } from 'zod';

export const SsrStrategySchema = z.enum([
    'static',
    'dynamic',
    'disabled'
]);

export const SsrVariantSchema = z.enum([
    'desktop',
    'mobile',
    'tablet'
]);

export const WidgetSsrSchema = z.object({
    strategy: SsrStrategySchema,
    variants: z.array(
        SsrVariantSchema
    ).optional()
});

export type SsrStrategy =
    z.infer<typeof SsrStrategySchema>;

export const WidgetImageOptimisationSchema = z.object({
    scanFormats: z.array(
        z.string()
    ),
    outputFormat: z.string(),
    quality: z.number()
});

export const WidgetRegistryEntrySchema = z.object({
    widget: z.string().optional(),
    cdn: z.string(),
    css: z.string().optional(),
    ssr: WidgetSsrSchema.optional(),
    imageOptimisation: WidgetImageOptimisationSchema.optional()
});

export const RegistrySchema = z.record(
    z.string(),
    WidgetRegistryEntrySchema
);

export type WidgetRegistryEntry =
    z.infer<typeof WidgetRegistryEntrySchema>;

export type WidgetRegistry =
    z.infer<typeof RegistrySchema>;