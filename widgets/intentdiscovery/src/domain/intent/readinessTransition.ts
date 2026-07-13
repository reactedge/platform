import type {IntentEvent} from "../../integration/intent/types.ts";

export function getInterpretationEvent(
    prev: number | null,
    current: number,
    intentText: string
): IntentEvent | null {
    if (prev === null) return null;

    if (prev > 0 && current <= 0) {
        return { type: "INTERPRETATION_READY", payload: { intent: intentText }};
    }

    if (prev <= 0 && current > 0) {
        return { type: "INTERPRETATION_STARTED" };
    }

    return null;
}