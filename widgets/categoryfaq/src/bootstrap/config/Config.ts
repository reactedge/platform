import {parseBootstrap, parseConfig} from "./ConfigSchema.ts";
import type {WidgetActivity} from "@reactedge/framework/activity";

export interface WidgetConfig {
    readonly data: {
        title: string;
        faqs: {
            question: string;
            answer: string;
        }[];
    };

    readonly settings: {
        colour: string;
    };
}

export const WIDGET_ID = 'categoryfaq';

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
    bootstrap: unknown,
    activity?: WidgetActivity
): WidgetConfig | null {
    try {
        const contract = parseConfig(rawContract);
        if (!Array.isArray(bootstrap) || bootstrap.length === 0) return null;

        const faqs = parseBootstrap(bootstrap);
        if (faqs.length === 0) return null;
        const resolved = {
            ...contract,
            data: {...contract.data, faqs},
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
    };
}
