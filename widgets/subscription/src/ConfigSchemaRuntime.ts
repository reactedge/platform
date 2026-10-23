import { z } from 'zod';

export const SchemaRuntimeConfig = z.object({
    integrations: z.object({
        magentoGraphql: z.object({
            api: z.string().url(),
        }).strict(),
    }).strict(),
    context: z.object({
        storeCode: z.string(),
        sku: z.string()
    }).strict()
}).strict();

export type SchemaRuntimeConfig =
    z.infer<typeof SchemaRuntimeConfig>;

export function parseRuntimeConfig(
    input: unknown
): SchemaRuntimeConfig {
    return SchemaRuntimeConfig.parse(input);
}
