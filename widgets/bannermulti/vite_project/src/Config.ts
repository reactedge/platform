import {type BannerSettingConfig, type BannerSlide} from "./components/Types.ts";
import type {WidgetActivity} from "./activity";
import {parseConfig} from "./ConfigSchema.ts";

export interface RawWidgetConfig {
    data: WidgetConfig
}
export interface WidgetConfig {
    readonly slides: BannerSlide[]

    readonly settings: BannerSettingConfig;
}

export const WIDGET_ID = 'bannermulti';

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