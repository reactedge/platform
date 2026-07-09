import {WIDGET_ID} from "../Config.ts";

export interface ActivityContext {
    widget: string;
    instance: string;
}

export function createActivityContext(
    host: HTMLElement
): ActivityContext {
    return {
        widget: WIDGET_ID,
        instance:
            host.dataset.instance ??
            WIDGET_ID
    };
}