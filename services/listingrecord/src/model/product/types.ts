import {z} from 'zod';

export const ProductImageSchema = z.object({
    url: z.url(),
    publicId: z.string().trim().min(1).max(500),
}).strict();

export const ProductInputSchema = z.object({
    listingId: z.uuid(),
    sku: z.string()
        .trim()
        .min(1)
        .max(15)
        .regex(/^[A-Za-z0-9-]+$/, 'SKU may contain only letters, numbers and hyphens'),
    title: z.string()
        .trim()
        .min(1)
        .max(150)
        .regex(/^[^<>]*$/, 'Title must not contain HTML'),
    description: z.string().trim().min(1).max(5000),
    price: z.number().finite().nonnegative().multipleOf(0.01),
    images: z.array(ProductImageSchema).max(10),
}).strict();

export const ProductSchema = ProductInputSchema.extend({id: z.uuid()});
export const ProductsSchema = z.array(ProductSchema);

export type ProductImage = z.infer<typeof ProductImageSchema>;
export type Product = z.infer<typeof ProductSchema>;
