import React from "react";
import type { ResolvedIntentDiscoveryConfig } from "../domain/intent-discovery.types.ts";
import { useCategory } from "../hooks/domain/useCategory.tsx";
import {IntentDiscoveryLoader} from "./IntentDiscovery/IntentDiscoveryLoader.tsx";
import {SpinnerOverlay} from "./global/SpinnerOverlay.tsx";

type Props = {
    config: ResolvedIntentDiscoveryConfig
    categoryUrlKey: string
};

export const IntentDiscoveryWidget = ({ config, categoryUrlKey }: Props) => {
    const { categoryData, categoryError, categoryLoading } =
        useCategory(categoryUrlKey);

    if (categoryLoading) return <SpinnerOverlay />;
    if (categoryError) return null; // if the connection to Magento fails, we fail silently
    if (!categoryData) return null;

    return (
        <IntentDiscoveryLoader
            config={config.data}
            categoryData={categoryData}
        />
    );
};
