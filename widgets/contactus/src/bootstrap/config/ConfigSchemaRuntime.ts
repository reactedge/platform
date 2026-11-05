import { z } from 'zod';

export const SchemaRuntimeConfig = z.object({
    integrations: z.object({
        cloudflare: z.object({
            siteKey: z.string(),
        }),
    }),
});

export type SchemaRuntimeConfig =
    z.infer<typeof SchemaRuntimeConfig>;

export function parseRuntimeConfig(
    input: unknown
): SchemaRuntimeConfig {
    return SchemaRuntimeConfig.parse(input);
}