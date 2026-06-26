import type {IntentEngineState, IntentEvent, IntentStatus} from "../../integration/intent/types.ts";
import type {MagentoLayeredNavigation} from "../../hooks/domain/useLayeredNavigation.tsx";

export interface IntentState {
    intentState: IntentEngineState;
    getAiReadiness: (attributeLayerData: MagentoLayeredNavigation) => number;
    setIntentText: (text: string) => void
    setIntentStatus: (status: IntentStatus) => void
    setPreference: (attributeCode: string, optionValue: string) => void,
    resetPreference: () => void,
    dispatch: (event: IntentEvent) => void
    resetIntent: () => void,
}