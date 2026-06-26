import type {
    MegaMenuDataConfig,
    MegaMenuSettingsConfig,
    WidgetConfig,
    RuntimeConfig
} from "./domain/megamenu.types.ts";
import type {WidgetActivity} from "./activity";
import {parseConfig} from "./ConfigSchema.ts";

export const WIDGET_ID = 'megamenu';

export interface RawWidgetConfig {
    readonly runtime: RuntimeConfig,
    readonly data: MegaMenuDataConfig;
    readonly settings?: {theme: MegaMenuSettingsConfig};
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


