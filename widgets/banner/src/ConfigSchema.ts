import { z } from 'zod';
import type {BannerSettingConfig, BannerSlide} from "./components/Types.ts";

export interface WidgetConfig {
    readonly slides: BannerSlide[]

    readonly settings: BannerSettingConfig;
}

const ImageSchema = z.object({
    src: z.string(),
    srcset: z.string().optional(),
    sizes: z.string().optional(),
    alt: z.string().optional(),
}).strict();

const SlideSchema = z.object({
    image: ImageSchema
}).strict();

export const WidgetConfigSchema = z.object({
    data: z.object({
        slides: z.array(SlideSchema).min(1),
        settings: z.object({
            mode: z.object({
                desktop: z.enum(['static', 'slider']),
                tablet: z.enum(['static', 'slider']),
                mobile: z.enum(['static', 'slider'])
            }).strict(),
            imageWidth: z.number(),
            imageHeight: z.number(),
            visibleSlides: z.number().optional().default(1),
            zoomActive: z.boolean().optional().default(false)
        }).strict()
    }).strict(),

}).strict();

export type SchemaWidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): SchemaWidgetConfig {
    return WidgetConfigSchema.parse(input);
}

export function normalizeOptionalFields<
    T extends Record<string, unknown>,
    K extends keyof T
>(
    data: T,
    optionalFields: K[]
): Omit<T, K> {

    const result = { ...data };

    for (const field of optionalFields) {
        if (result[field] === undefined) {
            delete result[field];
        }
    }

    return result;
}