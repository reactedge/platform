import type {DaysType} from "../../types/domain/bookingsystem.type.ts";
import type {IntentEvent} from "../../types/domain/event.type.ts";
import {groupEventsByStartTime} from "./groupEventsByStartTime.ts";

export function getDayScheduleForDay(
    day: DaysType,
    events: IntentEvent[]
): IntentEvent[] {
    const dayEvents = events.filter(event => event.day === day.day);

    const groupedByTime = groupEventsByStartTime(dayEvents);

    return Object.values(groupedByTime).map(eventsAtTime => eventsAtTime[0]);
}
