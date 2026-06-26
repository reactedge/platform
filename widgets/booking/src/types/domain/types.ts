// domain/types.ts

import type {EventStatus, ISODateString} from "./event.type.ts";
import type {KeystoneEventHost} from "../infra/keystone";

export interface EventTypeGroup {
    id: string;
    label: string;
    description?: string
}

export interface EventType {
    id: string;
    label: string;
    description?: string
}

export interface Event {
    id: string;
    day: string;
    startTime: ISODateString;
    endTime: ISODateString;
    status: EventStatus;
    venueName: string;
    hostName: string;
    eventTypeId: string;
}

export type EventHosts = KeystoneEventHost[]
export type EventHostIds = string[]

export interface FilterParams {
    eventTypeId: string;
    weekStart: string;
    venueId: string | undefined;
    eventHostIds: EventHostIds | undefined;
}

export interface Venue {
    id: string;
    code: string;
    name: string;
}