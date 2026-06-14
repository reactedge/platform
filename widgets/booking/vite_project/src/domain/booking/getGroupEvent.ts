import type {IntentEvent} from "../../types/domain/event.type.ts";
import type {EventType} from "../../types/domain/types.ts";
import type {DayGroupEvent} from "../../types/domain/dashboard.type.tsx";
import {getTime} from "../../lib/date.ts";

export function getGroupEvent(
    eventType: EventType,
    events: IntentEvent[]
): DayGroupEvent {
    if (events.length === 0) {
        throw new Error("getGroupEvent called with no events");
    }

    const firstEvent = events[0];

    const groupEvent: DayGroupEvent = {
        name: `${firstEvent.day} ${getTime(firstEvent.start)}`,
        day: firstEvent.day,
        venueName: firstEvent.venueName,
        startTime: firstEvent.start,
        status: firstEvent.status,
        eventType: eventType.label,
        eventHosts: [],
        orderedEventId: null,
        cartEvent: null,
        eventIds: [],
    };

    for (const event of events) {
        groupEvent.eventHosts.push({
            eventHostId: event.host.id,
            eventId: event.id,
        });

        groupEvent.eventIds.push(event.id);
    }

    return groupEvent;
}