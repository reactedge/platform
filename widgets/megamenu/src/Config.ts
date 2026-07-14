import type {
    MegaMenuDataConfig,
    MegaMenuSettingsConfig,
    WidgetConfig,
    RuntimeConfig
} from "./domain/megamenu.types.ts";
import type {WidgetActivity} from "./activity";
import {parseConfig, type SchemaWidgetConfig} from "./ConfigSchema.ts";

export const WIDGET_ID = 'megamenu';

export interface RawWidgetConfig {
    readonly runtime: RuntimeConfig,
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
 * @param rawConfig - Widget contract supplied by the host platform.
 * @param activity - Optional activity logger used during bootstrap.
 * @returns An immutable widget configuration.
 * @throws When the widget contract is invalid.
 */
export function readWidgetConfig(
    rawConfig: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const contract = parseConfig(rawConfig);
        const resolved = resolvedWidgetConfig(contract)

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
    schameConfig: SchemaWidgetConfig
): WidgetConfig {
    return {
        runtime: schameConfig.runtime,
        data: schameConfig.data,
        settings: {
            ...schameConfig.settings,
            theme: {
                ...schameConfig.settings.theme,
                dropdownLayouts: schameConfig.settings.theme.dropdownLayouts !== undefined?  schameConfig.settings.theme.dropdownLayouts: {}
            }
        }
    };
}