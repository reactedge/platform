import type {DaysType} from "../../types/domain/bookingsystem.type.ts";
import type {IntentEvent} from "../../types/domain/event.type.ts";
import type {AuthenticatedUser} from "../../types/domain/user.type.ts";
import type {DayGroupEvent} from "../../types/domain/dashboard.type.tsx";
import {groupEventsByStartTime} from "./groupEventsByStartTime.ts";
import {buildDayGroupEvent} from "./buildDayGroupEvent.ts";

export function getDayEventsForDay(
    day: DaysType,
    events: IntentEvent[],
    user: AuthenticatedUser | undefined
): DayGroupEvent[] {
    const dayEvents = events.filter(event => event.day === day.day);

    const groupedByTime = groupEventsByStartTime(dayEvents);

    const result: DayGroupEvent[] = [];

    for (const time in groupedByTime) {
        result.push(
            buildDayGroupEvent(time, groupedByTime[time], user)
        );
    }

    return result;
}

