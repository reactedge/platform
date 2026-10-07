import {z} from 'zod';

export const SellerIdSchema = z.string().trim().min(1).max(128);
export const ListingStatusSchema = z.enum(['active', 'disable', 'inreview']);

const ListingDetailsSchema = z.object({
    name: z.string().trim().min(1).max(50),
    status: ListingStatusSchema.default('active'),
}).strict();

export const ListingCreateSchema = ListingDetailsSchema.extend({
    sellerId: SellerIdSchema,
}).strict();

export const ListingUpdateSchema = z.object({
    name: z.string().trim().min(1).max(50),
    status: ListingStatusSchema.default('active'),
    sellerId: SellerIdSchema.optional(),
}).strict().transform(({sellerId: _sellerId, ...details}) => details);

export const ListingSchema = ListingCreateSchema.extend({id: z.uuid()});
export const ListingsSchema = z.array(ListingSchema);

export type ListingStatus = z.infer<typeof ListingStatusSchema>;
export type ListingCreateInput = z.infer<typeof ListingCreateSchema>;
export type ListingUpdateInput = z.output<typeof ListingUpdateSchema>;
export type Listing = z.infer<typeof ListingSchema>;
