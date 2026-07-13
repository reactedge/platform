import { z } from 'zod';

export const WidgetConfigSchema = z.object({
    data: z.object({
        title: z.string(),
        placeholder: z.string()
    }),

    runtime: z.object({
        observability: z.object({
            enabled: z.boolean()
        }),

        failureMode: z.object({
            enabled: z.boolean(),
            percentage: z.number()
                .min(0)
                .max(100)
        })
    }),

    integrations: z.object({}),

    translations: z.object({
        searchButton: z.string(),
        loading: z.string(),
        error: z.string()
    })
});

export type WidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): WidgetConfig {
    return WidgetConfigSchema.parse(input);
}