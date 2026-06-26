import type {IntentEngineState} from "../../integration/intent/types.ts";

export function getDynamicAttributes(intentState: IntentEngineState) {
    const intentAttributes = Object.keys(intentState.attributeScore)
    return intentAttributes.join("\n")
}