import {createRoot} from "react-dom/client";
import React from "react";
import {getMountedHost} from "./lib/hostReader.ts";
import {type RawWidgetConfig} from "./Config.ts";
import {ActivityContextProvider} from "./activity/Context/ActivityContextProvider.tsx";
import {WidgetWrapper} from "./WidgetWrapper.tsx";
import type {ReactEdgeRuntimeConfig} from "./domain/googlereviews.types.ts";

export async function mountWidget(hostElement: HTMLElement, config: RawWidgetConfig, runtimeConfig: ReactEdgeRuntimeConfig) {
    const mountedHost = getMountedHost(hostElement);

    createRoot(mountedHost).render(<ActivityContextProvider hostElement={hostElement}>
        <WidgetWrapper rawConfig={config} runtimeConfig={runtimeConfig} />
    </ActivityContextProvider>);
}
