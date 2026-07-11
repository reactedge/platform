import type {WidgetActivity} from "./activity";
import {parseConfig} from "./ConfigSchema.ts";
import type {WidgetConfig} from "./components/Types.ts";
import {normalizeCurrency} from "./lib/currency.ts";

export const WIDGET_ID = 'minicart'

export function readWidgetConfig(
    rawConfig: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const contract = parseConfig(rawConfig);

        const resolved = {
            data: contract.data,
            currency: normalizeCurrency(contract.runtime.currency),
            locale: contract.runtime.locale,
            primaryColor: contract.settings?.primaryColor,
            secondaryColour: contract.settings?.secondaryColour,
            isReady: contract.settings?.primaryColor !== ''
        };

        activity?.log(
            'bootstrap',
            'Config resolved',
            resolved
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