import { z } from 'zod';

export const SchemaRuntimeConfig = z.object({
    integrations: z.object({
        magentoGraphql: z.object({
            api: z.string().url(),
        })
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