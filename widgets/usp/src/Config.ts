import {type UspSettings, type UspSlideData} from "./components/Types.ts";
import {parseConfig} from "./ConfigSchema.ts";
import type {WidgetActivity} from "./activity";

export interface WidgetConfig {
    /**
     * Structured banner payload.
     * Shape is banner-owned and opaque to the platform.
     */
    readonly data: {
        slides: UspSlideData[]
    }

    readonly settings: UspSettings;
}

export interface RuntimeConfig {
    userAgent: string;
}

export interface RawWidgetConfig {
    readonly data: {
        slides: UspSlideData[]
    }

    readonly settings: UspSettings;
}

export const WIDGET_ID = 'usp';

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