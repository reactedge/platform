import {useState} from "react";
import {useIntentDecision} from "./useIntentDecision.tsx";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import type {IntentControllerState} from "../../domain/intent.types.ts";

export const useIntentController = (
    config: IntentDiscoveryDataConfig
) => {
    const [intentText, setIntentText] = useState("");
    const { remainingChars } = useIntentDecision(config, intentText)

    const intent: IntentControllerState = {
        text: intentText,
        setIntent: setIntentText,
        remainingChars
    }

    return { intent }
}