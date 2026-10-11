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
    const parsed = SchemaRuntimeConfig.safeParse(input);
    if (!parsed.success) {
        const details = parsed.error.issues
            .map((issue) => {
                const path = issue.path.length > 0
                    ? issue.path.join(".")
                    : "<root>";
                return `${path}: ${issue.message}`;
            })
            .join("; ");
        throw new Error(`Invalid CMSBlock runtime config: ${details}`);
    }

    return parsed.data;
}
