import { z } from "zod";

const coordinate = z.object({ lat: z.number().min(49).max(61), lng: z.number().min(-9).max(3) }).strict();
export const WidgetConfigSchema = z.object({
  data: z.object({
    defaultCenter: coordinate.default({ lat: 52.3555, lng: -1.1743 }),
    zoom: z.number().int().min(1).max(20).default(6),
  }).default({ defaultCenter: { lat: 52.3555, lng: -1.1743 }, zoom: 6 }),
  integration: z.object({ requires: z.array(z.string()).optional() }).optional(),
  translations: z.record(z.string(), z.string()).optional(),
}).strict();

export type SchemaWidgetConfig = z.infer<typeof WidgetConfigSchema>;
export function parseConfig(input: unknown): SchemaWidgetConfig {
  return WidgetConfigSchema.parse(input);
}
