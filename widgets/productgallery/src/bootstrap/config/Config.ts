import {type WidgetConfig} from "../../components/Types.ts";
import type {WidgetActivity} from "@reactedge/framework/activity";
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
 * @param contract - Widget contract supplied by the host platform.
 * @param bootstrap - Widget bootstrap supplied by the host platform.
 * @param runtime - Runtime services supplied by the orchestrator.
 * @param activity - Activity logger for bootstrap events.
 * @returns An immutable Contact Us configuration.
 * @throws When either configuration is invalid.
 */
export function readWidgetConfig(
    contract: unknown,
    bootstrap: unknown,
    runtime: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const effectiveContract = {
            ...(contract as object),
            data: {
                images: bootstrap
            }
        };

        const parsedContract = parseConfig(effectiveContract);
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
        tiles: widget.data.images,
        settings: widget.settings,
        runtime: {
            storeCode: runtime.context.storeCode,
            sku: runtime.context.sku
        },
        integrations: {
            magentoGraphql: runtime.integrations?.magentoGraphql
        }
    };
}
