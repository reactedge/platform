import {createRoot} from "react-dom/client";
import {MinicartWidgetWrapper} from "./MinicartWidgetWrapper.tsx";
import {activity} from "./activity";
import {getMountedHost} from "./widget-runtime/lib/hostReader.ts";

export const WIDGET_ID = 'minicart';

export function mountWidget(hostElement: HTMLElement) {
    const mountedHost = getMountedHost(hostElement);

    activity('bootstrap', 'Widget mounted', hostElement);

    // Create React root inside shadow
    const root = createRoot(mountedHost);
    root.render(<MinicartWidgetWrapper host={hostElement}/>);
}
