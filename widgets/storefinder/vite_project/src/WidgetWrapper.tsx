import React from 'react';
import {type RawWidgetConfig, readWidgetConfig} from "./Config.ts";
import {useActivityContext} from "./activity/Context/useActivityContext.ts";
import {TranslationStateProvider} from "./state/Translation/TranslationStateProvider.tsx";
import {StoreFinder} from "./components/StoreListing.tsx";
import type {ReactEdgeRuntimeConfig} from "./domain/store.types.ts";

type Props = {
    rawConfig: RawWidgetConfig;
    runtimeConfig: ReactEdgeRuntimeConfig
    onStable?: () => void;
};

export const WidgetWrapper = ({ rawConfig, runtimeConfig }: Props) => {
    const activity = useActivityContext()
    const config = readWidgetConfig(rawConfig, runtimeConfig, activity);

    if (!config) return null;

    return (
        <TranslationStateProvider translations={config.translations}>
            <StoreFinder config={config} />
        </TranslationStateProvider>
    );

};

