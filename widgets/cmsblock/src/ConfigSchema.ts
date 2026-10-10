import {z} from 'zod';

const WidgetSourceSchema = z.object({
    format: z.enum(['text', 'html']),
    content: z.string().max(100_000),
}).strict();

const WidgetDataSchema = z.object({
    title: z.string().min(1),
    source: WidgetSourceSchema.default({format: 'text', content: ''}),
    templateId: z.enum(['editorial', 'feature', 'promotion']).default('editorial'),
    // Optional for existing widget contracts.
    layoutId: z.enum(['image-above', 'image-left', 'image-right']).optional(),
    image: z.object({src: z.string().url().max(2000), alt: z.string().max(500)}).strict().optional(),
}).strict();

const WidgetSettingsSchema = z.object({
    colour: z.string(),
}).strict();

export const WidgetConfigSchema = z.object({
    data: WidgetDataSchema,
    settings: WidgetSettingsSchema,
}).strict();

export type WidgetConfig = z.infer<typeof WidgetConfigSchema>;

export function parseConfig(input: unknown): WidgetConfig {
    return WidgetConfigSchema.parse(input);
}
