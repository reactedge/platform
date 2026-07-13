import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {useIntentController} from "../../hooks/domain/useIntentController.tsx";
import {useIntentState} from "../../state/Intent/useIntentState.ts";
import type {MagentoLayeredNavigation} from "../../hooks/domain/useLayeredNavigation.tsx";
import {SearchSpinnerOverlay} from "../global/SearchSpinnerOverlay.tsx";
import {IntentMessage} from "./IntentDiscoveryLayout/IntentMessage.tsx";
import {AttributeLayer} from "./IntentDiscoveryLayout/AttributeLayer.tsx";
import {IntentDiscoveryOptions} from "./IntentDiscoveryLayout/IntentDiscoveryOptions.tsx";
import {ProductRecommendations} from "./IntentDiscoveryLayout/ProductRecommendations.tsx";

export interface Props {
    config: IntentDiscoveryDataConfig
    categoryData: CategoryData
    attributeLayerData: MagentoLayeredNavigation
}

export const IntentDiscoveryLayout = ({ config, categoryData, attributeLayerData}: Props) => {
    const { intent } = useIntentController(config)
    const { intentState } = useIntentState()

    const isProcessing =
        intentState.status === "suggestionProcessing" ||
        intentState.status === "readyToRecommend";

    return (
        <div className="intent-widget">
            {isProcessing && <SearchSpinnerOverlay />}
            <div className={intentState.status === "suggestionSent" ? "re-intent-layout re-intent-layout--two" : "re-intent-layout"}>
                <div className="re-intent-col re-intent-col--left">
                    <IntentMessage
                        intent={intent}
                        attributeLayerData={attributeLayerData}
                    />
                    <AttributeLayer
                        config={config}
                        intent={intent}
                        attributeLayerData={attributeLayerData}
                        categoryData={categoryData}
                    />
                    <IntentDiscoveryOptions
                        categoryData={categoryData}
                        attributeLayerData={attributeLayerData}
                    />
                </div>
                <div className="re-intent-col re-intent-col--right">
                    <ProductRecommendations />
                </div>
            </div>
        </div>
    );
};