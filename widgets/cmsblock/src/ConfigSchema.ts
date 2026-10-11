import { z } from "zod";

const WidgetSourceSchema = z.object({
    format: z.enum(["text", "html"]),
    content: z.string().max(100_000),
}).strict().default({ format: "text", content: "" });

const WidgetDataSchema = z.object({
    title: z.string().min(1),
    source: WidgetSourceSchema,
    templateId: z.enum(["editorial", "feature", "promotion"]).default("editorial"),
    layoutId: z.enum(["image-above", "image-left", "image-right"]).optional(),
    image: z.object({
        src: z.string().url().max(2000),
        alt: z.string().max(500),
    }).strict().optional(),
}).strict();

const WidgetSettingsSchema = z.object({
    colour: z.string(),
}).passthrough();

export const WidgetConfigSchema = z.object({
    data: WidgetDataSchema,
    settings: WidgetSettingsSchema,
}).passthrough();

export type SchemaWidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): SchemaWidgetConfig {
    return WidgetConfigSchema.parse(input);
}
