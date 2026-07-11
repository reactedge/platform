import {type BannerSettingConfig, type BannerSlide} from "./components/Types.ts";
import type {WidgetActivity} from "./activity";
import {normalizeOptionalFields, parseConfig, type SchemaWidgetConfig} from "./ConfigSchema.ts";

export interface WidgetConfig {
    readonly slides: BannerSlide[]

    readonly settings: BannerSettingConfig;
}

export const WIDGET_ID = 'banner';

export function readWidgetConfig(
    rawConfig: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const contract = parseConfig(rawConfig);
        const resolved = resolvedWidgetConfig(contract)

        activity?.log(
            'bootstrap',
            'Config resolved',
            contract
        );

        return Object.freeze(resolved);

    } catch (e) {
        activity?.log(
            'bootstrap',
            'Invalid widget contract',
            e instanceof Error? e.message: e,
            'error'
        );

        throw e;
    }
}


function resolvedWidgetConfig(
    schameConfig: SchemaWidgetConfig
): WidgetConfig {
    return {
        slides: schameConfig.data.slides.map((slide) => ({
            ...slide,
            image: normalizeOptionalFields(
                slide.image,
                ['srcset', 'sizes', 'alt']
            ),
        })),
        settings: schameConfig.data.settings
    };
}