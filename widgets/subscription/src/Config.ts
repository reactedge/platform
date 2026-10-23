import {parseConfig, type SchemaWidgetConfig} from "./ConfigSchema.ts";
import type {WidgetActivity} from "@reactedge/framework/activity";
import {parseRuntimeConfig, type SchemaRuntimeConfig} from "./ConfigSchemaRuntime.ts";

export interface WidgetConfig {
    readonly data: {
        title: string;
        oneTimePurchaseLabel: string;
        subscriptionLabel: string;
        plansTitle: string;
        subscribeButtonLabel: string;
        plans: {
            id: string;
            frequency: string;
            discount: string;
            termsUrl: string;
        }[];
    }

    readonly settings: {
        colour: string;
    };

    readonly runtime: RuntimeConfig
    readonly integrations: ResolvedConfigIntegrations
}

export interface RuntimeConfig {
    storeCode: string;
    sku: string;
}

export interface ReactEdgeRuntimeConfig {
    readonly integrations: ReactEdgeRuntimeIntegrations;
    readonly context: RuntimeConfig
}

export interface ReactEdgeRuntimeIntegrations {
    readonly magentoGraphql: {
        readonly api: string
    };
}

export interface ResolvedConfigIntegrations {
    readonly magentoGraphql: {
        readonly api: string
    };
}

export const WIDGET_ID = 'subscription';

/**
 * Validates and resolves the Subscription widget configuration.
 *
 * Both the widget contract and the runtime configuration are treated
 * as untrusted input. Once validated, the configuration is normalized,
 * resolved and frozen before being exposed to the React application.
 *
 * This function represents the trust boundary between the ReactEdge
 * runtime and the widget implementation.
 *
 * The resolved configuration includes the Magento GraphQL integration
 * required by this widget's runtime.
 *
 * @param contract - Widget contract supplied by the host platform.
 * @param runtime - Runtime services supplied by the orchestrator.
 * @param activity - Activity logger for bootstrap events.
 * @returns An immutable Subscription configuration.
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
