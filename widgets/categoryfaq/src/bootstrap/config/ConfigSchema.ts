import { z } from 'zod';

const FaqSchema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
}).strict();

export const WidgetConfigSchema = z.object({
    data: z.object({
        title: z.string().min(1),
        faqs: z.array(FaqSchema),
    }).strict(),
    settings: z.object({
        colour: z.string(),
    }).strict(),
}).strict();

export type WidgetConfig = z.infer<typeof WidgetConfigSchema>;

export function parseConfig(input: unknown): WidgetConfig {
    return WidgetConfigSchema.parse(input);
}
