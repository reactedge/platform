import { z } from "zod";

export const baseWidgetContractSchema = z.object({
    data: z.unknown(),
    runtime: z.object({}).optional(),
    integrations: z.object({}).optional(),
}).strict();


