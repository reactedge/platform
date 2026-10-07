import {parseConfig, type SchemaWidgetConfig} from "./ConfigSchema.ts";
import type {WidgetActivity} from "@reactedge/framework/activity";
import {parseRuntimeConfig, type SchemaRuntimeConfig} from "./ConfigSchemaRuntime.ts";

export interface WidgetConfig {
    readonly data: {
        title: string;
    }

    readonly settings: {
        colour: string;
    };

    readonly runtime: RuntimeConfig
    readonly integrations: ResolvedConfigIntegrations
}

export type RuntimeConfig = {
    readonly sellerId?: string;
};
export type ReactEdgeRuntimeIntegrations = Record<string, never>;
export type ResolvedConfigIntegrations = Record<string, never>;

export interface ReactEdgeRuntimeConfig {
    readonly integrations: ReactEdgeRuntimeIntegrations;
    readonly context: RuntimeConfig;
}

export const WIDGET_ID = 'createlisting';

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
        runtime: runtime.context,
        integrations: runtime.integrations,
    };
}
