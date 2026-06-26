import type {EventHostIds} from "./types.ts";

export type BookingStep =
    | 'Week'
    | 'EventTypeGroup'
    | 'EventType'
    | 'Host'
    | (string & {})

export interface InitFilterConfig {
    venueName?: string
    labels?: {
        week?: string
        eventTypeGroup?: string
        eventType?: string
    }
}

export interface WidgetConfig {
    venueId: string;
    eventHostIds: EventHostIds;
    turnstile?: {
        siteKey: string;
    };
}


export interface DaysType {
    day: string
    dayLabel: string
}

export interface WeeksType {
    weekStart: string
    weekLabel: string
}

