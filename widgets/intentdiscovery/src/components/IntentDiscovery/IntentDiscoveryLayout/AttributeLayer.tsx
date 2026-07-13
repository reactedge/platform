import {IntentExplanation} from "./AttributeLayer/IntentExplanation.tsx";
import {AttributeSelectorLayer} from "./AttributeLayer/AttributeSelectorLayer.tsx";
import {useAttributeLayerController} from "./AttributeLayer/AttributeLayer.controller.ts";
import type {IntentDiscoveryDataConfig} from "../../../domain/intent-discovery.types.ts";
import type {IntentControllerState} from "../../../domain/intent.types.ts";
import type {MagentoLayeredNavigation} from "../../../hooks/domain/useLayeredNavigation.tsx";
import type {CategoryData} from "../../../types/infra/magento/category.types.ts";

export type Props = {
    config: IntentDiscoveryDataConfig
    intent: IntentControllerState
    attributeLayerData: MagentoLayeredNavigation,
    categoryData: CategoryData
}
export const AttributeLayer = (props: Props) => {
    const { handleAsk, shouldHide } = useAttributeLayerController(props);

    if (shouldHide) return null;

    return (
        <div className="finder">
            <IntentExplanation
                attributeLayerData={props.attributeLayerData}
                intent={props.intent}
                remainingChars={props.intent.remainingChars}
                onAsk={handleAsk}
            />

            <AttributeSelectorLayer
                attributeLayerData={props.attributeLayerData}
                config={props.config}
            />
        </div>
    );
};