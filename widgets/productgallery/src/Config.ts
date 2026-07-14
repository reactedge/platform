import {type WidgetConfig} from "./components/Types.ts";
import type {WidgetActivity} from "./activity";
import {parseConfig, type SchemaWidgetConfig} from "./ConfigSchema.ts";
import {parseRuntimeConfig, type SchemaRuntimeConfig} from "./ConfigSchemaRuntime.ts";

export const WIDGET_ID = 'productgallery';

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
 * @param rawConfig - Widget contract supplied by the host platform.
 * @param runtimeConfig - Runtime services supplied by the orchestrator.
 * @param activity - Activity logger for bootstrap events.
 * @returns An immutable Contact Us configuration.
 * @throws When either configuration is invalid.
 */
export function readWidgetConfig(
    rawConfig: unknown,
    runtimeConfig: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const contract = parseConfig(rawConfig);
        const runtime = parseRuntimeConfig(runtimeConfig)

        const resolved = resolveConfig(contract, runtime);

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
        tiles: widget.data.images,
        runtime: {
            storeCode: runtime.context.storeCode,
            sku: runtime.context.sku
        },
        integrations: {
            magentoGraphql: runtime.integrations?.magentoGraphql
        }
    };
}
