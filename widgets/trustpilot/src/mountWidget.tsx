import {createRoot} from "react-dom/client";
import {activity} from "./activity";
import {getMountedHost} from "./widget-runtime/lib/hostReader.ts";
import {TrustpilotWidgetWrapper} from "./TrustpilotWidgetWrapper.tsx";

export const WIDGET_ID = 'trustpilot';

export function mountWidget(hostElement: HTMLElement) {
    const mountedHost = getMountedHost(hostElement);

    activity('bootstrap', 'Widget mounted', hostElement);

    const root = createRoot(mountedHost);
    root.render(<TrustpilotWidgetWrapper host={hostElement}/>);
}
