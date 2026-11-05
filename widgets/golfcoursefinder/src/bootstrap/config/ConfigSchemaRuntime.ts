import { z } from "zod";

export const SchemaRuntimeConfig = z.object({
    integrations: z.object({
        golfcoursesApi: z.object({
            api: z.string().url(),
        }).strict(),
        googleMaps: z.object({
            apiKey: z.string().min(1),
        }).optional(),
    }).passthrough(),
}).passthrough();

export type SchemaRuntimeConfig = z.infer<typeof SchemaRuntimeConfig>;

export function parseRuntimeConfig(input: unknown): SchemaRuntimeConfig {
    const result = SchemaRuntimeConfig.safeParse(input);
    if (!result.success) {
        const details = result.error.issues
            .map(issue => `${issue.path.join(".") || "<root>"}: ${issue.message}`)
            .join("; ");
        throw new Error(`Invalid golf course finder runtime config: ${details}`);
    }
    return result.data;
}
