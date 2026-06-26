// domain/types/Event.ts

import type {EventType} from "./types.ts";
import type {OrderItemEventRef} from "../infra/keystone";

export interface IntentEvent {
    id: string;
    day: string;
    start: string;   // ISO
    end: string;     // ISO
    status: EventStatus
    venueName: string
    host: Pick<EventHost, 'id' | 'name'>
    orderItem: OrderItemEventRef
}

export type ISODateString = string;

export type KeystoneEventFilter = {
    status?: {
        equals?: EventStatus;
    };
    venue?: {
        id?: {
            equals?: string;
        };
    };
    startTime?: {
        gte?: ISODateString;
    };
    endTime?: {
        lte?: ISODateString;
    };
    eventHost?: {
        id?: {
            in?: string[];
        };
    };
};

//export type EventStatus = "ACTIVE" | "CANCELLED" | "DRAFT" ;
export type EventStatus = 'open' | 'pastevent' | 'walkin' | 'wasordered' | (string & {})

export const WALKIN = 'walkin'

export const BUSY = 'unavailable'

export const AVAILABLE = 'open'

export const PAST_EVENT = 'pastevent'
export const WALKIN_EVENT = 'walkin'

export const UNAVAILABLE_EVENT= 'unavailable'

export const IN_CART_EVENT = 'incart'

export const PREFERENCE_RESET = 'reset'

export const PURCHASED_EVENT = 'wasordered'


export interface EventHostIndex {
    id: string;          // eventHost id
    eventTypeId: string; // one supported event type
}

// domain/filters/EventFilterKeys.ts
export type EventFilterKey =
    | "status"
    | "venue"
    | "startTime"
    | "endTime"
    | "eventHost";

export type EventFilterState = Partial<Record<EventFilterKey, unknown>>;

export interface EventHost {
    id: string;
    name: string;
    description: string;
    eventTypes?: EventType[]
}

export interface EventsQueryKey {
    venueId: string;
    weekStart: string;
    hostIds: string[];
}
