import {useMemo} from "react";
import {type GalleryWidgetConfig, readWidgetConfig} from "../Config.ts";

export function useWidgetConfig(
    host: HTMLElement
): GalleryWidgetConfig | null {
    return useMemo(() => {
        const baseConfig = readWidgetConfig(host);
        if (!baseConfig) {
            return null;
        }

        return baseConfig
    }, [host]);
}



