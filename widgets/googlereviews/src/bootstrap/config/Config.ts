import type {WidgetActivity} from "@reactedge/framework/activity";
import {parseConfig} from "./ConfigSchema.ts";
import {parseRuntimeConfig} from "./ConfigSchemaRuntime.ts";
import type {SchemaWidgetConfig} from "./ConfigSchema.ts"
import type {SchemaRuntimeConfig} from "./ConfigSchemaRuntime.ts"

export interface GoogleReviewsDataConfig {
    title: string
}

/* -------------------- */
/* Runtime              */
/* -------------------- */

export interface ReactEdgeRuntimeConfig {
    readonly integrations: ReactEdgeRuntimeIntegrations;
}

export interface ReactEdgeRuntimeIntegrations {
    readonly googleMaps: {
        readonly apiKey: string;
        readonly placeId: string;
    };
}

export type TranslationsConfig = Record<string, string> | undefined;


/* -------------------- */
/* Resolved Config      */
/* -------------------- */

export interface WidgetConfig {
    readonly data: GoogleReviewsDataConfig;
    readonly integrations: ReactEdgeRuntimeIntegrations;
    readonly translations: TranslationsConfig
}


export const WIDGET_ID = 'googlereviews';

/**
 * Validates and resolves the Contact Us widget configuration.
 *
 * Both the widget contract and the runtime configuration are treated
 * as untrusted input. Once validated, the configuration is normalized,
 * resolved and frozen before being exposed to the React application.
 *
 * This function represents the trust boundary between the ReactEdge
 * runtime and the widget implementation.
 *
 * The resolved configuration includes the Cloudflare integration
 * required to render the captcha.
 *
 * @param contract - Widget contract supplied by the host platform.
 * @param runtime - Runtime services supplied by the orchestrator.
 * @param activity - Activity logger for bootstrap events.
 * @returns An immutable Contact Us configuration.
 * @throws When either configuration is invalid.
 */
export function readWidgetConfig(
    contract: unknown,
    runtime: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const parsedContract = parseConfig(contract);
        const parsedRuntime = parseRuntimeConfig(runtime)
        const resolved = resolveConfig(parsedContract, parsedRuntime);

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

export function resolveConfig(
    widget: SchemaWidgetConfig,
    runtime: SchemaRuntimeConfig
): WidgetConfig {
    return {
        data: widget.data,
        integrations: {
            googleMaps: runtime.integrations?.googleMaps
        },
        translations: widget.translations
    };
}
