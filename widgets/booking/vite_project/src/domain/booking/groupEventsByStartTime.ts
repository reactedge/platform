import type {IntentEvent} from "../../types/domain/event.type.ts";

export function groupEventsByStartTime(
    events: IntentEvent[]
): Record<string, IntentEvent[]> {
    return events.reduce<Record<string, IntentEvent[]>>((times, event) => {
        const { start } = event;
        if (!times[start]) {
            times[start] = [];
        }
        times[start].push(event);
        return times;
    }, {});
}