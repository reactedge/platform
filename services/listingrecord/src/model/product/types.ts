import {z} from 'zod';

export const ProductImageSchema = z.object({
    url: z.url(),
    publicId: z.string().trim().min(1).max(500),
}).strict();

export const ProductInputSchema = z.object({
    listingId: z.uuid(),
    sku: z.string().trim().min(1).max(100),
    title: z.string().trim().min(1).max(150),
    description: z.string().trim().min(1).max(5000),
    price: z.number().finite().nonnegative(),
    images: z.array(ProductImageSchema).max(10),
}).strict();

export const ProductSchema = ProductInputSchema.extend({id: z.uuid()});
export const ProductsSchema = z.array(ProductSchema);

export type ProductImage = z.infer<typeof ProductImageSchema>;
export type Product = z.infer<typeof ProductSchema>;
