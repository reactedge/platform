import {z} from 'zod';

export const CmsBlockRuntimeConfigSchema = z.object({
    integrations: z.object({
        cmsblockApi: z.object({
            baseUrl: z.string().url(),
        }).strict(),
    }).passthrough(),
}).passthrough();

export type CmsBlockRuntimeConfig = z.infer<typeof CmsBlockRuntimeConfigSchema>;

export function parseRuntimeConfig(input: unknown): CmsBlockRuntimeConfig {
    return CmsBlockRuntimeConfigSchema.parse(input);
}
