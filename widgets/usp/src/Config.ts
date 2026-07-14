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
    rendering: {
        userAgent: string;
    }
}

export interface RawWidgetConfig {
    readonly data: {
        slides: UspSlideData[]
    }

    readonly settings: UspSettings;
}

export const WIDGET_ID = 'usp';

/**
 * Validates the widget contract and returns an immutable configuration.
 *
 * The contract is treated as untrusted input and is validated before
 * being exposed to the React application.
 *
 * This function represents the trust boundary between the ReactEdge
 * runtime and the widget implementation for widgets that do not require
 * runtime integrations.
 *
 * @param rawConfig - Widget contract supplied by the host platform.
 * @param activity - Optional activity logger used during bootstrap.
 * @returns An immutable widget configuration.
 * @throws When the widget contract is invalid.
 */
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