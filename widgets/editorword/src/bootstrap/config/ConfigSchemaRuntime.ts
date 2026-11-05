import { z } from 'zod';

export const SchemaRuntimeConfig = z.object({
    integrations: z.object({
        magentoGraphql: z.object({
            api: z.string().url(),
        }).optional(),
        googleMaps: z.object({
            apiKey: z.string(),
            placeId: z.string()
        }).optional()
    }),
    context: z.object({
        storeCode: z.string(),
        sku: z.string()
    })
});

export type SchemaRuntimeConfig =
    z.infer<typeof SchemaRuntimeConfig>;

export function parseRuntimeConfig(
    input: unknown
): SchemaRuntimeConfig {
    return SchemaRuntimeConfig.parse(input);
}