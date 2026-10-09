import {parseConfig} from "./ConfigSchema.ts";
import type {WidgetActivity} from "@reactedge/framework/activity";

export interface WidgetConfig {
    readonly data: {
        title: string;
    }

    readonly settings: {
        colour: string;
    };
}

export const WIDGET_ID = 'cmsblock';

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
 * @param rawContract - Widget contract supplied by the host platform.
 * @param activity - Optional activity logger used during bootstrap.
 * @returns An immutable widget configuration.
 * @throws When the widget contract is invalid.
 */
export function readWidgetConfig(
    rawContract: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const contract = parseConfig(rawContract);

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