import type {KeystoneEvent} from "../../../types/infra/keystone";
import type {EventStatus, IntentEvent} from "../../../types/domain/event.type.ts";

export function mapKeystoneGroupEvent(event: KeystoneEvent): IntentEvent {
    return {
        id: event.id,
        day: event.day,
        start: event.startTime,
        end: event.endTime,
        status: event.status as EventStatus,
        venueName: event.venue.name,
        host: event.eventHost,
        orderItem: event.orderItem
        //eventTypeId: event.orderItem.event.id,
    };
}

export function mapKeystoneEvent(event: KeystoneEvent): IntentEvent {
    return {
        id: event.id,
        day: event.day,
        start: event.startTime,
        end: event.endTime,
        status: event.status as EventStatus,
        venueName: event.venue.name,
        host: event.eventHost,
        orderItem: event.orderItem
        //eventTypeId: event.orderItem.event.id,
    };
}