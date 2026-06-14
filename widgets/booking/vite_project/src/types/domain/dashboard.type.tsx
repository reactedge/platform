import type {EventStatus, IntentEvent} from "./event.type.ts";
import type {DaysType} from "./bookingsystem.type.ts";

export interface DaySchedule {
    day: DaysType;
    groups: DayGroupEvent[];
}

export interface DayGroupEvent {
    name: string
    day: string
    status: EventStatus
    startTime: string
    venueName: string
    eventType?: string // Pick<EventType, 'id' | 'name'>
    eventHosts: GroupEventEventHostMap[] //Pick<EventHost, 'id' | 'name'>[]
    orderedEventId: string | null
    cartEvent: IntentEvent | null
    eventIds: string[]
}

export interface GroupEventEventHostMap {
    eventId: string,
    eventHostId: string
}