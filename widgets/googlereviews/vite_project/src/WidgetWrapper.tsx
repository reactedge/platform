import React from 'react';
import {type RawWidgetConfig, readWidgetConfig} from "./Config.ts";
import {useActivityContext} from "./activity/Context/useActivityContext.ts";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {GoogleReviews} from "./components/GoogleReviews.tsx";
import {TranslationStateProvider} from "./state/Translation/TranslationStateProvider.tsx";
import type {ReactEdgeRuntimeConfig} from "./domain/googlereviews.types.ts";

type Props = {
    rawConfig: RawWidgetConfig;
    runtimeConfig: ReactEdgeRuntimeConfig;
};

export const WidgetWrapper = ({ rawConfig, runtimeConfig}: Props) => {
    const activity = useActivityContext()
    const config = readWidgetConfig(rawConfig, runtimeConfig, activity);

    if (!config) return null;

    return <TranslationStateProvider translations={config.translations}>
        <SystemStateProvider config={config}>
            <GoogleReviews config={config} />
        </SystemStateProvider>
    </TranslationStateProvider>
};

