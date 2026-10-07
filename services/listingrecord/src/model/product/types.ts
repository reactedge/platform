import {z} from 'zod';

export const ProductInputSchema = z.object({
    listingId: z.uuid(),
    sku: z.string().trim().min(1).max(100),
    title: z.string().trim().min(1).max(150),
    description: z.string().trim().min(1).max(5000),
    price: z.number().finite().nonnegative(),
    images: z.array(z.url()).min(1).max(10),
}).strict();

export const ProductSchema = ProductInputSchema.extend({id: z.uuid()});
export const ProductsSchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;
