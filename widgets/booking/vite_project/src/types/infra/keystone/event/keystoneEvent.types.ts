import type {ISODateString} from "../../../domain/event.type.ts";

export interface KeystoneEvent {
    id: string;
    startTime: ISODateString;
    endTime: ISODateString;
    day: string;
    status: string;
    venue: {
        name: string;
    };
    eventHost: {
        id: string;
        name: string;
    };
    orderItem: OrderItemEventRef;
}

export interface OrderItemEventRef {
    event: {
        id: string;
    };
}

export interface KeystoneEventCalculationParams {
    [key: string]: unknown;
    eventId?: string;
    eventTypeId?: string;
    shampoo?: 0 | 1;
}

export interface KeystoneCartEventParams {
    [key: string]: unknown;
    eventId?: string;
    eventTypeId?: string;
    shampoo?: 0 | 1;
    userId: string;
}