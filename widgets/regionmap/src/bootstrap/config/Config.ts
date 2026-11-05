import type {WidgetActivity} from "@reactedge/framework/activity";
import type {ReactEdgeRuntimeConfig, WidgetConfig} from "../../domain/regionmap.types.ts";
import {normalizeOptionalFields, parseConfig, type SchemaWidgetConfig} from "./ConfigSchema.ts";
import {parseRuntimeConfig} from "./ConfigSchemaRuntime.ts";

export const WIDGET_ID = 'regionmap';

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
    activity: WidgetActivity
): WidgetConfig {
    try {
        const parseContract = parseConfig(contract);
        const parseRuntime = parseRuntimeConfig(runtime)
        const resolved = resolveWidgetConfig(parseContract, parseRuntime);

        activity.log('bootstrap', 'Config resolved', {
            data: resolved.data,
            integrations: resolved.integrations,
            translations: resolved.translations
        });

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

export function resolveWidgetConfig(
    widget: SchemaWidgetConfig,
    runtime: ReactEdgeRuntimeConfig
): WidgetConfig {
    const data = normalizeOptionalFields(widget.data, ["title"])

    return {
        data,
        integrations: runtime.integrations,
        translations: widget.translations
    };
}
