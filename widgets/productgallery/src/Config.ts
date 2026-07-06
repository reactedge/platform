import {type GalleryTile} from "./components/Types.ts";

export interface GalleryWidgetConfig {
    readonly tiles: GalleryTile[]
}

export function readWidgetConfig(
    hostElement: HTMLElement
): GalleryWidgetConfig {
    const configScript = hostElement.querySelector<HTMLScriptElement>(
        'script[type="application/json"][data-config]'
    );

    if (!configScript) {
        throw new Error("Product Gallery widget requires a <script data-config> block.");
    }

    try {
        const parsed = JSON.parse(configScript.textContent || "{}");

        return Object.freeze({
            tiles: parsed.data.images ?? []
        });
    } catch {
        return {
            tiles: []
        };
    }
}
