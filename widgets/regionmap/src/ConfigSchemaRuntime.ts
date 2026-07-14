import { z } from 'zod';

export const SchemaRuntimeConfig = z.object({
    integrations: z.object({
        googleMaps: z.object({
            apiKey: z.string(),
        })
    })
});

export type SchemaRuntimeConfig =
    z.infer<typeof SchemaRuntimeConfig>;

export function parseRuntimeConfig(
    input: unknown
): SchemaRuntimeConfig {
    return SchemaRuntimeConfig.parse(input);
}