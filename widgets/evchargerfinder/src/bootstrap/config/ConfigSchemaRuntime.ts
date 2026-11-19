import { z } from "zod";

export const SchemaRuntimeConfig = z.object({
  integrations: z.object({
    evchargerfinderApi: z.object({ api: z.string().url() }).strict(),
  }).passthrough(),
  context: z.object({}).passthrough().optional(),
}).passthrough();

export type SchemaRuntimeConfig = z.infer<typeof SchemaRuntimeConfig>;
export function parseRuntimeConfig(input: unknown): SchemaRuntimeConfig {
  return SchemaRuntimeConfig.parse(input);
}
