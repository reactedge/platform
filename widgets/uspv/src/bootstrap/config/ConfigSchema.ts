import * as z from 'zod/mini';

/*
 * Strict-CSP compatibility: by default Zod probes `new Function("")` to
 * decide whether it may JIT-compile object parsers. Under a
 * Content-Security-Policy without 'unsafe-eval' that probe is blocked and
 * reported as a `script-src` violation on every page load. `jitless`
 * disables the probe and the JIT path; validation results are unchanged.
 *
 * `zod/mini` exposes the same validation core through tree-shakable
 * functions instead of chained methods, which keeps the widget bundle
 * smaller. Schemas still provide `.parse()` and `.safeParse()`.
 */
z.config({ jitless: true });

const UspvSlideSchema = z.strictObject({
    heading: z.optional(
        z.string().check(z.minLength(1), z.maxLength(30))
    ),
    text: z.string().check(z.minLength(1), z.maxLength(80))
});

const WidgetDataSchema = z.strictObject({
    slides: z.array(UspvSlideSchema).check(z.minLength(1), z.maxLength(6))
});

/**
 * Auto-rotation interval, in milliseconds, between two slides.
 * Manual arrow navigation permanently stops the timer.
 */
const UspvTimerSchema = z.int().check(z.gte(1000), z.lte(60000));

const WidgetSettingsSchema = z.strictObject({
    timer: z._default(UspvTimerSchema, 5000),
    theme: z._default(
        z.enum([
            'light',
            'dark',
            'promo'
        ]),
        'light'
    )
});

/**
 * Optional UI translations, keyed by the English source string
 * (same contract shape as the store finder widget).
 */
const TranslationsSchema = z.record(
    z.string(),
    z.string()
);

export const WidgetConfigSchema = z.strictObject({
    data: WidgetDataSchema,
    settings: WidgetSettingsSchema,
    translations: z.optional(TranslationsSchema)
});

export type WidgetConfig =
    z.infer<typeof WidgetConfigSchema>;

export function parseConfig(
    input: unknown
): WidgetConfig {
    return WidgetConfigSchema.parse(input);
}
