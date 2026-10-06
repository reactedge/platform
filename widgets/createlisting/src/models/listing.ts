import { z } from 'zod';

export const ListingInputSchema = z.object({
    name: z.string().trim().min(1, 'Enter a listing name.').max(50, 'Listing names must be 50 characters or fewer.'),
}).strict();

export const ListingSchema = ListingInputSchema.extend({ id: z.uuid() });
export const ListingsSchema = z.array(ListingSchema);
export type Listing = z.infer<typeof ListingSchema>;
