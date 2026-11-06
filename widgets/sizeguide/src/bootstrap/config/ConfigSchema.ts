import { z } from 'zod';

const CountrySchema = z.object({
    code: z.string().min(2),
    name: z.string().min(1),
    flag: z.string().optional(),
}).strict();

const SizeSchema = z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    labels: z.record(z.string(), z.string()),
}).strict();

const MeasurementSchema = z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    values: z.record(z.string(), z.number().nonnegative()),
    unit: z.enum(['cm', 'in']),
}).strict();

const MeasurementInstructionSchema = z.object({
    title: z.string().min(1),
    text: z.string().min(1),
}).strict();

export const WidgetConfigSchema = z.object({
    data: z.object({
        title: z.string().min(1),
        productType: z.string().min(1),
        description: z.string().optional(),
        countries: z.array(CountrySchema).min(1),
        defaultCountry: z.string().min(2),
        sizes: z.array(SizeSchema).min(1),
        measurements: z.array(MeasurementSchema).min(1),
        instructions: z.array(MeasurementInstructionSchema).default([]),
        diagram: z.object({
            src: z.string().min(1),
            alt: z.string(),
        }).strict().optional(),
    }).strict(),
    settings: z.object({
        colour: z.string(),
        accentColour: z.string(),
        defaultUnit: z.enum(['cm', 'in']),
    }).strict(),
}).strict();

export type WidgetConfig = z.infer<typeof WidgetConfigSchema>;

export function parseConfig(input: unknown): WidgetConfig {
    return WidgetConfigSchema.parse(input);
}
