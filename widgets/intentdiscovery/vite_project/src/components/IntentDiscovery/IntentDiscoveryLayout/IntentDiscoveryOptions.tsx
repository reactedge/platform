import {Icon} from "./AttributeLayer/Icon.tsx";
import type {CategoryData} from "../../../types/infra/magento/category.types.ts";
import type {MagentoLayeredNavigation} from "../../../hooks/domain/useLayeredNavigation.tsx";
import {useInteractionState} from "../../../state/Interaction/useInteractionState.ts";
import {useIntentState} from "../../../state/Intent/useIntentState.ts";
import {useEffect} from "react";
import {activity} from "../../../activity";
import {FinderRow} from "./IntentDiscoveryOptions/FinderRow.tsx";
import {StepPriceFinder} from "./IntentDiscoveryOptions/FinderWidget/StepPriceFinder.tsx";
import {StepFinder} from "./IntentDiscoveryOptions/FinderWidget/StepFinder.tsx";

export interface Props {
    categoryData: CategoryData
    attributeLayerData: MagentoLayeredNavigation
}

export const IntentDiscoveryOptions = ({
       attributeLayerData
   }: Props) => {
    const { navigation } = useInteractionState().interactionState;
    const stepCode = navigation.activeAttribute
    const { intentState } = useIntentState()
    const isSearching = intentState.status === "suggestionProcessing"

    useEffect(() => {
        if (stepCode !== null) {
            activity('intent-discovery', 'Intent Discover Step', stepCode);
        }
    }, [stepCode]);

    if (!attributeLayerData || stepCode === null) return null;

    let step;

    if (stepCode === "price") {
        step = <StepPriceFinder attributeLayerData={attributeLayerData} />;
    } else {
        step = <StepFinder optionCode={stepCode} attributeLayerData={attributeLayerData} />;
    }

    if (isSearching) return null; // make the feature more compact when the search is processing

    return (
        <div className="finder">
            <FinderRow>
                <Icon attribute_code={stepCode} size={70} />
                {step}
            </FinderRow>
        </div>
    );
};