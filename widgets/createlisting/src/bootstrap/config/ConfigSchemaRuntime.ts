import { z } from 'zod';

export const SchemaRuntimeConfig = z.object({
    integrations: z.object({}).default({}),
    context: z.object({
        sellerId: z.string().trim().min(1).max(128).optional(),
    }).default({}),
});

export type SchemaRuntimeConfig = z.infer<typeof SchemaRuntimeConfig>;

export function parseRuntimeConfig(input: unknown): SchemaRuntimeConfig {
    return SchemaRuntimeConfig.parse(input);
}
