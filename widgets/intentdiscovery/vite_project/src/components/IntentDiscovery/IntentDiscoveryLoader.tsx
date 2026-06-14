import React from "react";
import {ErrorState} from "../global/ErrorState.tsx";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {activity} from "../../activity";
import {IntentDiscoveryLayout} from "./IntentDiscoveryLayout.tsx";
import {InteractionStateProvider} from "../../state/Interaction/InteractionStateProvider.tsx";
import {useIntentState} from "../../state/Intent/useIntentState.ts";
import {type MagentoLayeredNavigation, useLayeredNavigation} from "../../hooks/domain/useLayeredNavigation.tsx";

type LoaderProps = {
    config: IntentDiscoveryDataConfig
    categoryData: CategoryData
}

export const IntentDiscoveryLoader = ({ config, categoryData }: LoaderProps) => {
    const { intentState } = useIntentState()

    const {
        attributeLayerData,
        attributeLayerError
    } = useLayeredNavigation(categoryData, intentState, config)

    if (attributeLayerError) return <ErrorState error={attributeLayerError} />
    if (!attributeLayerData) return null

    activity('attribute-layer', 'Attribute Layer', attributeLayerData);

    return (
        <InteractionStateProvider>
            <IntentDiscoveryLayout
                config={config}
                categoryData={categoryData}
                attributeLayerData={attributeLayerData as MagentoLayeredNavigation}
            />
        </InteractionStateProvider>
    )
}