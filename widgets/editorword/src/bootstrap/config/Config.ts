import {parseConfig, type SchemaWidgetConfig} from "./ConfigSchema.ts";
import type {WidgetActivity} from "@reactedge/framework/activity";

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

export type RuntimeConfig = Record<string, never>;

export interface ReactEdgeRuntimeConfig {
    readonly integrations: ReactEdgeRuntimeIntegrations;
    readonly context: RuntimeConfig
}

export type ReactEdgeRuntimeIntegrations = Record<string, never>;

export type ResolvedConfigIntegrations = Record<string, never>;

export const WIDGET_ID = 'editorword';

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
        const resolved = resolveConfig(parsedContract);

        activity?.log(
            'bootstrap',
            'Config runtime',
            runtime
        );

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
    widget: SchemaWidgetConfig
): WidgetConfig {
    return {
        data: widget.data,
        settings: widget.settings,
        runtime: {},
        integrations: {}
    };
}
