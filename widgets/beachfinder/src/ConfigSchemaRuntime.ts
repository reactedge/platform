import { z } from "zod";

export const SchemaRuntimeConfig = z.object({
    integrations: z.object({
        beachfinderApi: z.object({ api: z.string().url() }).strict(),
    }).passthrough(),
}).passthrough();

export type SchemaRuntimeConfig = z.infer<typeof SchemaRuntimeConfig>;

export function parseRuntimeConfig(input: unknown): SchemaRuntimeConfig {
    const parsed = SchemaRuntimeConfig.safeParse(input);
    if (!parsed.success) {
        const details = parsed.error.issues
            .map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`)
            .join("; ");
        throw new Error(`Invalid Beach Finder runtime config: ${details}`);
    }
    return parsed.data;
}
