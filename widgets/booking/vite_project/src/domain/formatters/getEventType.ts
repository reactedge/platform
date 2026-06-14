import type {DayGroupEvent} from "../../types/domain/dashboard.type.tsx";
import {capitalise} from "../../lib/string.ts";
import {getDate, getTime} from "../../lib/date.ts";

export const getEventType = (event: DayGroupEvent) => {
    return `${capitalise(event.eventType)}`
}

export const getEventDateTime = (event: DayGroupEvent) => {
    return `${capitalise(event.day)} ${getDate(event.startTime)} at ${getTime(event.startTime)}`
}

