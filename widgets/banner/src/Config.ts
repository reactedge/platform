import {WidgetActivity} from "./activity";
import type {BannerSettingConfig, BannerSlide} from "./components/Types.ts";
import {parseConfig} from "./ConfigSchema.ts";

export interface RawWidgetConfig {
    data: WidgetConfig
}

export interface RuntimeConfig {
    userAgent: string
}

export const WIDGET_ID = 'banner';

export interface WidgetConfig {
    readonly slides: BannerSlide[]

    readonly settings: BannerSettingConfig;
}

export function readWidgetConfig(
    rawConfig: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const contract = parseConfig(rawConfig);

        activity?.log(
            'bootstrap',
            'Config resolved',
            contract
        );

        return Object.freeze(contract);

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
