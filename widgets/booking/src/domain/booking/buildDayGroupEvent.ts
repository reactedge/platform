import type {DayGroupEvent} from "../../types/domain/dashboard.type.tsx";
import type {IntentEvent} from "../../types/domain/event.type.ts";
import type {AuthenticatedUser} from "../../types/domain/user.type.ts";
import {getTime} from "../../lib/date.ts";
import {isEventInCart} from "../cart/cart.ts";

function createEmptyDayGroupEvent(startTime: string): DayGroupEvent {
    return {
        name: "",
        day: "",
        venueName: "",
        status: "",
        startTime,
        eventHosts: [],
        orderedEventId: null,
        cartEvent: null,
        eventIds: []
    };
}

function applyEventToGroup(
    group: DayGroupEvent,
    event: IntentEvent,
    user?: AuthenticatedUser
): void {
    group.day = event.day;
    group.name = `${event.day} ${getTime(event.start)}`;
    group.venueName = event.venueName;

    group.eventHosts.push({
        eventHostId: event.host.id,
        eventId: event.id
    });

    if (event.orderItem?.event) {
        group.orderedEventId = event.id;
    }

    if (user && isEventInCart(user.cartItems, event.id)) {
        group.cartEvent = event;
    }

    group.eventIds.push(event.id);
}

export function buildDayGroupEvent(
    startTime: string,
    events: IntentEvent[],
    user?: AuthenticatedUser
): DayGroupEvent {
    const group = createEmptyDayGroupEvent(startTime);

    for (const event of events) {
        applyEventToGroup(group, event, user);
    }

    return group;
}
