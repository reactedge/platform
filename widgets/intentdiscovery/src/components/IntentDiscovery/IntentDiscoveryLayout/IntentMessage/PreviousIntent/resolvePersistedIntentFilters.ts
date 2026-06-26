import {mapIntentToDisplay} from "./mapIntentToDisplay.ts";
import type {MergedAttribute} from "../../../../../hooks/infra/useMagentoLayeredData.tsx";
import type {PersistedIntentV1} from "../../../../../services/intentPersistence/intentPersistence.service.ts";
import type {OptionLabelMap} from "../../../../../domain/intent-discovery.types.ts";

export function resolvePersistedIntentFilters(
    attributes: MergedAttribute[],
    intent: PersistedIntentV1,
    optionLabelMap: OptionLabelMap
) {

    const attributeMap = Object.fromEntries(
        attributes.map(a => [a.code, a])
    );

    const attributesDisplay = mapIntentToDisplay(
        intent?.attributeScore,
        attributeMap,
        optionLabelMap
    );

    return attributesDisplay;
}


