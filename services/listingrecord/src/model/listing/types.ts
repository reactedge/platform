import {z} from 'zod';

export const ListingStatusSchema = z.enum(['active', 'disable', 'inreview']);

export const ListingInputSchema = z.object({
    name: z.string().trim().min(1).max(50),
    status: ListingStatusSchema.default('active'),
}).strict();

export const ListingSchema = ListingInputSchema.extend({id: z.uuid()});
export const ListingsSchema = z.array(ListingSchema);

export type ListingStatus = z.infer<typeof ListingStatusSchema>;
export type ListingInput = z.infer<typeof ListingInputSchema>;
export type Listing = z.infer<typeof ListingSchema>;
