import type { WidgetConfig } from "../bootstrap/config/Config.ts";
import type { BannerModeValue } from "../components/Types.ts";

export function resolveMode(
    width: number,
    config: WidgetConfig
): BannerModeValue {
    if (width <= 640) return config.settings.mode.mobile;
    if (width <= 1024) return config.settings.mode.tablet;
    return config.settings.mode.desktop;
}