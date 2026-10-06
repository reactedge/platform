import {z} from 'zod';

export const ListingInputSchema = z.object({
    name: z.string().trim().min(1).max(50),
}).strict();
export const ListingSchema = ListingInputSchema.extend({id: z.uuid()});
export const ListingsSchema = z.array(ListingSchema);
export type Listing = z.infer<typeof ListingSchema>;
