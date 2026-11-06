import {parseConfig} from "./ConfigSchema.ts";
import type {WidgetActivity} from "@reactedge/framework/activity";
import {parseRuntimeConfig} from "./ConfigSchemaRuntime.ts";
import type {ReactEdgeRuntimeConfig} from "@reactedge/public-api/runtime.ts";
import type {ReactEdgeRuntimeIntegrations, SellerFinderDataConfig, TranslationsConfig} from "../../domain/seller.types.ts";

export interface WidgetConfig {
    readonly data: SellerFinderDataConfig;
    readonly integrations: ReactEdgeRuntimeIntegrations;
    readonly translations: TranslationsConfig
}

export interface RawWidgetConfig {
    data: SellerFinderDataConfig;
    integration: {
        requires: ('googleMaps')[];
    };
    translations?: TranslationsConfig
}

export const WIDGET_ID = 'sellerfinder';

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

        activity?.log('bootstrap', 'Config resolved', {
            data: resolved.data,
            integrations: resolved.integrations,
            translations: resolved.translations
        });

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

export function resolveConfig(
    widget: RawWidgetConfig,
    runtime: ReactEdgeRuntimeConfig
): WidgetConfig {
    return {
        data: widget.data,
        integrations: runtime.integrations,
        translations: widget.translations
    };
}
