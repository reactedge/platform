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
    urlSuffix: z.string().optional(),

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
            image: z.string().nullable().optional(),
            children: z.array(
                MenuItemSchema
            ),
            meta: z.object({
                type: z.enum([
                    'link',
                    'cta',
                    'banner'
                ]),
                icon: z.enum([
                    'arrow',
                    'external'
                ]).optional(),
            }).optional()
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

export type WidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): WidgetConfig {
    return WidgetConfigSchema.parse(input);
}