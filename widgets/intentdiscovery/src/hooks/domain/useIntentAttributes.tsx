import { useMemo } from "react"
import {applyIntentConfig} from "../../lib/attributes"
import type { IntentDiscoveryDataConfig } from "../../domain/intent-discovery.types"
import {useIntentState} from "../../state/Intent/useIntentState.ts";
import type {MergedAttribute} from "../infra/useMagentoLayeredData.tsx";

export function useFindIntentProducts() {
    const {intentState} = useIntentState()
    const intentAttributes = Object.keys(intentState.attributeScore)

    return intentAttributes.join("\n")
}

export function useIntentAttributes(
    attributeData: MergedAttribute[],
    config: IntentDiscoveryDataConfig
) {
    return useMemo(
        () => applyIntentConfig(attributeData, config),
        [attributeData, config]
    )
}