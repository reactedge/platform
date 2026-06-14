import { createRoot } from "react-dom/client";
import {RegionMapWidget} from "./RegionMapWidget.tsx";
import {activity} from "./activity";
import {getMountedHost} from "./lib/hostReader.ts";
import type {RegionMapWidgetConfig} from "./domain/regionmap.types.ts";

export const WIDGET_ID = 'regionmap';

export function mountWidget(hostElement: HTMLElement, rawConfig?: RegionMapWidgetConfig) {
    const mountedHost = getMountedHost(hostElement);
    hostElement.classList.add(`reactedge-${WIDGET_ID}`);

    activity('bootstrap', 'Widget mounted', hostElement);

    // Create React root inside shadow
    const root = createRoot(mountedHost);
    root.render(<RegionMapWidget host={hostElement} rawConfig={rawConfig} />);
}
