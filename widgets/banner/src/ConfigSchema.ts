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
            visibleSlides: z.number().optional(),
            ssr: z.object({
                height: z.number()
            }).optional()
        }).strict()
    }).strict(),

}).strict();

export type RawWidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): WidgetConfig {
    const rawConfig = WidgetConfigSchema.parse(input);
    return rawConfig.data
}