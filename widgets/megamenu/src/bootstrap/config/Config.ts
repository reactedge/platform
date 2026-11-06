import type {
    MegaMenuDataConfig,
    MegaMenuSettingsConfig
} from "../../domain/megamenu.types.ts";
import type {WidgetActivity} from "@reactedge/framework/activity";
import {parseConfig, type SchemaWidgetConfig} from "./ConfigSchema.ts";

export const WIDGET_ID = 'megamenu';

export interface WidgetConfig {
    readonly data: MegaMenuDataConfig;
    readonly settings?: {theme: MegaMenuSettingsConfig};
}

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
 * @param contract - Widget contract supplied by the host platform.
 * @param bootstrap - Widget bootstrap supplied by the host platform.
 * @param activity - Optional activity logger used during bootstrap.
 * @returns An immutable widget configuration.
 * @throws When the widget contract is invalid.
 */
export function readWidgetConfig(
    contract: unknown,
    bootstrap: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const effectiveContract = {
            ...(contract as object),
            data: {
                items: bootstrap
            }
        };

        const parsedContract = parseConfig(effectiveContract);
        const resolved = resolvedWidgetConfig(
            parsedContract
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


function resolvedWidgetConfig(
    schemaConfig: SchemaWidgetConfig
): WidgetConfig {
    return {
        data: schemaConfig.data,
        settings: {
            ...schemaConfig.settings,
            theme: {
                ...schemaConfig.settings.theme,
                dropdownLayouts: schemaConfig.settings.theme.dropdownLayouts !== undefined?  schemaConfig.settings.theme.dropdownLayouts: {}
            }
        }
    };
}