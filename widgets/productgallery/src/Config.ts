import {type GalleryTile, type WidgetConfig} from "./components/Types.ts";
import type {WidgetActivity} from "./activity";
import {parseConfig} from "./ConfigSchema.ts";

export interface GalleryWidgetConfig {
    readonly tiles: GalleryTile[]
}

export const WIDGET_ID = 'productgallery';

export function readWidgetConfig(
    rawConfig: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const contract = parseConfig(rawConfig);

        const resolved = {
            tiles: contract.data.images
        };

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
