import { z } from "zod";

export const SchemaRuntimeConfig = z.object({
    integrations: z.object({
        cmsblockApi: z.object({
            api: z.string().url(),
        }).strict(),
    }).passthrough(),
    context: z.object({
        storeCode: z.string(),
        sku: z.string(),
        category: z.string().optional(),
    }).passthrough(),
}).passthrough();

export type SchemaRuntimeConfig =
    z.infer<typeof SchemaRuntimeConfig>;

export function parseRuntimeConfig(
    input: unknown
): SchemaRuntimeConfig {
    return SchemaRuntimeConfig.parse(input);
}
