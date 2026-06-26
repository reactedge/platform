import { createRoot } from "react-dom/client";
import ContactUsWidget from "./ContactUsWidget.tsx";
import {activity} from "./activity";
import {getMountedHost} from "./widget-runtime/lib/hostReader.ts";

import './styles/contactus.css'
import type {ContactUsRawConfig} from "./domain/contact.types.ts";

export const WIDGET_ID = 'contactus';

export async function mountWidget(hostElement: HTMLElement, config?: ContactUsRawConfig) {
    const mountedHost = getMountedHost(hostElement);
    hostElement.classList.add(`reactedge-${WIDGET_ID}`);

    activity('bootstrap', 'Widget mounted', hostElement);

    const root = createRoot(mountedHost);
    root.render(<ContactUsWidget rawConfig={config}/>);
}
