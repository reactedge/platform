import { createRoot } from "react-dom/client";
import ProductGalleryWidget from "./WidgetWrapper.tsx";
import {getMountedHost} from "./lib/hostReader.ts";

export const WIDGET_ID = 'productgallery';

export function mountWidget(hostElement: HTMLElement) {
    const mountedHost = getMountedHost(hostElement);
    hostElement.classList.add(`reactedge-${WIDGET_ID}`);


    // Create React root inside shadow
    const root = createRoot(mountedHost);
    root.render(<ProductGalleryWidget host={hostElement}/>);
}
