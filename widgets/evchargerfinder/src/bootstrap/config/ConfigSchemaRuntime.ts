import { z } from "zod";

export const SchemaRuntimeConfig = z.object({
  integrations: z.object({
    openChargeMapApi: z.object({ api: z.string().url(), apiKey: z.string().optional() }).strict(),
    ukPostcodesApi: z.object({ api: z.string().url() }).strict(),
  }).passthrough(),
}).passthrough();

export type SchemaRuntimeConfig = z.infer<typeof SchemaRuntimeConfig>;
export function parseRuntimeConfig(input: unknown): SchemaRuntimeConfig {
  return SchemaRuntimeConfig.parse(input);
}
