import type { UspModeValue} from "../components/Types.ts";
import type {WidgetConfig} from "../Config.ts";

export function resolveMode(width: number, config: WidgetConfig): UspModeValue {
    if (width <= 480) return config.settings.mode.mobile;
    if (width <= 768) return config.settings.mode.tablet;
    return config.settings.mode.desktop;
}