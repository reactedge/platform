import { parseConfig, type SchemaWidgetConfig } from "./ConfigSchema.ts";
import type { WidgetActivity } from "@reactedge/framework/activity";
import { parseRuntimeConfig, type SchemaRuntimeConfig } from "./ConfigSchemaRuntime.ts";
import type {
    IntentDiscoveryDataConfig,
    ReactEdgeRuntimeIntegrations, ResolvedRuntimeConfig
} from "../../types/domain/intent-discovery.types.ts";
import type { TranslationsConfig } from "../../types/domain/translation.ts"

export interface WidgetConfig {
    /**
     * Structured banner payload.
     * Shape is banner-owned and opaque to the platform.
     */
    readonly data: IntentDiscoveryDataConfig
    readonly runtime: ResolvedRuntimeConfig
    readonly translations?: TranslationsConfig
    readonly integrations: ReactEdgeRuntimeIntegrations
}

export interface ReactEdgeRuntimeConfig {
    readonly integrations: ReactEdgeRuntimeIntegrations;
    readonly context: {
        category: string;
        storeCode: string;
    }
}

export interface ResolvedConfigIntegrations {
    readonly magentoGraphql: {
        readonly api: string
    };
    readonly intentApi: {
        readonly baseUrl: string;
    };
}
export const WIDGET_ID = 'intentdiscovery';

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
        const parsedContract = parseConfig(contract);
        const parsedRuntime = parseRuntimeConfig(runtime)
        const resolved = resolveConfig(parsedContract, parsedRuntime);

        activity?.log(
            'bootstrap',
            'Config resolved',
            {
                resolved,
                bootstrap
            }
        );

        return Object.freeze(resolved);

    } catch (e) {
        activity?.log(
            'bootstrap',
            'Invalid widget contract',
            e instanceof Error ? e.message : e,
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
        runtime: {
            storeCode: runtime.context.storeCode,
            category: runtime.context.category
        },
        integrations: {
            magentoGraphql: runtime.integrations?.magentoGraphql,
            intentApi: runtime.integrations?.intentApi
        }
    };
}
