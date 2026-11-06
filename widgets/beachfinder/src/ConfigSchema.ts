import { z } from "zod";

export const WidgetConfigSchema = z.object({
    data: z.object({
        title: z.string().trim().min(1).max(100),
        description: z.string().max(300).optional(),
    }).strict(),
}).strict();

export type SchemaWidgetConfig = z.infer<typeof WidgetConfigSchema>;

export function parseConfig(input: unknown): SchemaWidgetConfig {
    return WidgetConfigSchema.parse(input);
}
