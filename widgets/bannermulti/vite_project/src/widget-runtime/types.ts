import type {RuntimeLoadMode} from "./WidgetConfig/runtimeMode.ts";
import type {WidgetConfig} from "./WidgetConfig.ts";

export interface RuntimeConfig {
    /**
     * Logical source identifier of the widget
     * (used for observability, caching, debugging)
     */
    readonly src?: string;

    /**
     * Load strategy hint
     * Does NOT control rendering logic directly
     */
    readonly load: RuntimeLoadMode;

    /**
     * Page or placement identifier
     * (home, plp, pdp, checkout, cms, etc.)
     */
    readonly page?: string;
}

export type HostPlatform =
    | "magento"
    | "wordpress"
    | "static"
    | "unknown";

export interface HostConfig {
    /**
     * Platform the widget is embedded in.
     * Used for integration quirks, not behaviour.
     */
    readonly name: HostPlatform;

    /**
     * Logical widget identifier / theme key.
     * Used for styling and contract routing.
     */
    readonly widget: string;
}

export interface WidgetMountProps {
    readonly runtime: RuntimeConfig;
    readonly host: HostConfig;
    readonly widget: WidgetConfig
}
