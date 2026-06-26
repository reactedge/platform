import type {IntentEngineState, IntentSnapshot} from "../../integration/intent/types.ts";
import {getFiltersHash} from "../../lib/attributes.ts";

export function isSnapshotCompatible(
    snapshot: IntentSnapshot | null,
    intentState: IntentEngineState
): boolean {
    if (!snapshot) return false;

    // ❗ 1. Must have usable recommendations
    if (!snapshot.recommendations || snapshot.recommendations.length === 0) {
        return false;
    }

    const currentHash = getFiltersHash(intentState.attributeScore);

    return snapshot.filtersHash === currentHash || snapshot.intentText !== '';
}