import {createRoot} from "react-dom/client";
import {MinicartWidgetWrapper} from "./MinicartWidgetWrapper.tsx";
import {getMountedHost} from "./widget-runtime/lib/hostReader.ts";
import {ActivityContextProvider} from "./activity/Context/ActivityContextProvider.tsx";

export const WIDGET_ID = 'minicart';

export function mountWidget(hostElement: HTMLElement) {
    const mountedHost = getMountedHost(hostElement);

    // Create React root inside shadow
    const root = createRoot(mountedHost);
    root.render(
        <ActivityContextProvider hostElement={hostElement}>
            <MinicartWidgetWrapper host={hostElement}/>
        </ActivityContextProvider>);
}
