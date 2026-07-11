import { z } from 'zod';
import type {NavItem} from "./domain/megamenu.types.ts";

const RuntimeSchema = z.object({
    platform: z.enum([
        'magento',
        'wordpress'
    ])
}).strict();

const ThemeSchema = z.object({
    dataLocale: z.string(),
    fontColor: z.string(),
    primaryColor: z.string(),
    secondaryColor: z.string(),
    urlSuffix: z.string().optional().default(".html"),

    dropdownLayouts: z.record(
        z.string(),
        z.enum([
            'tiles',
            'list'
        ])
    ).optional()
}).strict();


const MenuItemSchema: z.ZodType<NavItem> =
    z.lazy(() =>
        z.object({
            id: z.string(),
            label: z.string(),
            url: z.string(),
            image: z.string().nullable().optional().default(null),
            children: z.array(
                MenuItemSchema
            ),
            meta: z.object({
                type: z.enum(['link', 'cta', 'banner']).optional(),
                icon: z.enum(['arrow', 'external']).optional(),
            }).optional().default({})
        }).strict()
    );

export const WidgetConfigSchema =
    z.object({
        runtime: RuntimeSchema,

        data: z.object({
            items: z.array(
                MenuItemSchema
            )
        }).strict(),

        settings: z.object({
            theme: ThemeSchema
        }).strict()
    }).strict();

export type SchemaWidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): SchemaWidgetConfig {
    return WidgetConfigSchema.parse(input);
}

export function normalizeOptionalFields<
    T extends Record<string, unknown>,
    K extends keyof T
>(
    data: T,
    optionalFields: K[]
): Omit<T, K> {

    const result = { ...data };

    for (const field of optionalFields) {
        if (result[field] === undefined) {
            delete result[field];
        }
    }

    return result;
}