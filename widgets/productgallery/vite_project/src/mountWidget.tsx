import { createRoot } from "react-dom/client";
import ProductGalleryWidget from "./ProductGalleryWidget.tsx";
import {activity} from "./activity";
import {getMountedHost} from "./lib/hostReader.ts";

export const WIDGET_ID = 'productgallery';

export function mountWidget(hostElement: HTMLElement) {
    const mountedHost = getMountedHost(hostElement);
    hostElement.classList.add(`reactedge-${WIDGET_ID}`);

    activity('bootstrap', 'Widget mounted', hostElement);

    // Create React root inside shadow
    const root = createRoot(mountedHost);
    root.render(<ProductGalleryWidget host={hostElement}/>);
}
