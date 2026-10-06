import { z } from 'zod';

export const SchemaRuntimeConfig = z.object({
    integrations: z.object({}).default({}),
    context: z.object({}).default({}),
});

export type SchemaRuntimeConfig = z.infer<typeof SchemaRuntimeConfig>;

export function parseRuntimeConfig(input: unknown): SchemaRuntimeConfig {
    return SchemaRuntimeConfig.parse(input);
}
