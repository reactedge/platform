import z from 'zod';

export const WidgetContractSchema =
    z.object({
        widget: z.string(),
        version: z.string().optional(),
        js: z.string().url(),
        css: z.string().url().optional(),
        ssr: z.string().optional()
    });

export type WidgetContract =
    z.infer<
        typeof WidgetContractSchema
    >;

export const RegistrySchema =
    z.record(
        z.string(),
        WidgetContractSchema
    );