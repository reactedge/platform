import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import {useDebounce} from "../useDebounce.tsx";

const MIN_TEXT_LENGTH = 50

export const useIntentDecision = (
    config: IntentDiscoveryDataConfig,
    intentText: string
) => {

    const threshold = config.ai?.activationThreshold ?? MIN_TEXT_LENGTH
    const debouncedIntent = useDebounce(intentText, 400)

    const text = debouncedIntent.trim()
    const remainingChars = threshold - text.length;

    return {
        remainingChars
    }
}