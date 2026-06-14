import {buildAiInterpretationPayload} from "../../lib/ai-recommendations.ts";
import {sendRequestToAi} from "../../services/message-interpret.ts";
import type {IntentControllerState} from "../../domain/intent.types.ts";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import {useOptionLabelMap} from "./useOptionLabelMap.ts";
import {useSystemState} from "../../state/System/useSystemState.ts";
import {useIntentState} from "../../state/Intent/useIntentState.ts";
import type {MagentoLayeredNavigation} from "./useLayeredNavigation.tsx";
import type {MergedAttribute} from "../infra/useMagentoLayeredData.tsx";

type UseAskAiParams = {
    intent: IntentControllerState;
    attributeLayerData: MagentoLayeredNavigation,
    config: IntentDiscoveryDataConfig;
    setLoading: (loading: boolean) => void;
};

export const useAskAi = ({
      intent,
      attributeLayerData,
      config,
      setLoading
  }: UseAskAiParams) => {
    const optionLabelMap = useOptionLabelMap(attributeLayerData.attributes);
    const { intentEngine} = useSystemState()
    const { intentState, setIntentText, setPreference, resetPreference} = useIntentState()
    const intentApiClient = intentEngine.getApiClient()
    const { dispatch } = useIntentState()

    return async () => {
        const payload = buildAiInterpretationPayload(
            intentState,
            attributeLayerData.attributes as MergedAttribute[],
            intent.text,
            optionLabelMap,
            config
        )

        dispatch({ type: "INTERPRETATION_PROCESSING"});

        await sendRequestToAi({
            payload,
            intentApiClient,
            setLoading,
            onSuccess: (json) => {
                //dispatch({ type: "INTERPRETATION_DONE", filters: json.filters, intent: payload.intent.text});
                dispatch({ type: "INTERPRETATION_DONE"});
                resetPreference()

                if (!json?.filters?.length && payload.intent.text!== "") {
                    dispatch({ type: "SUGGESTION_EMPTY"});
                    return
                }

                setIntentText(intent.text)

                for (const filter of json?.filters || []) {
                    if (!filter.attribute || !filter.value) {
                        continue
                    }

                    setPreference(filter.attribute, filter.value)
                }
            }
        })
    }
};