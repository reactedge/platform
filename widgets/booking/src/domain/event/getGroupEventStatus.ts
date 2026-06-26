import type {DayGroupEvent} from "../../types/domain/dashboard.type.tsx";
import {
    AVAILABLE,
    type EventStatus,
    IN_CART_EVENT,
    PAST_EVENT,
    PURCHASED_EVENT,
    WALKIN
} from "../../types/domain/event.type.ts";
import {isPastEvent} from "./isPastEvent.ts";
import type {GroupEventInfoState} from "../../state/GroupEvent/type.ts";

export const groupEventStatus = (eventGroup: DayGroupEvent): EventStatus => {
    if (isPastEvent(eventGroup)) {
        return PAST_EVENT
    }

    if (eventGroup?.cartEvent !== null) {
        return IN_CART_EVENT
    }

    if (eventGroup?.orderedEventId !== null) {
        return PURCHASED_EVENT
    }

    if (eventGroup.status === WALKIN) {
        return WALKIN
    }

    return AVAILABLE
}

export const groupEventStatusLabel = (eventGroup: DayGroupEvent): string => {
    if (isPastEvent(eventGroup)) {
        return 'Too late'
    }

    if (eventGroup?.cartEvent !== null) {
        return 'In cart'
    }

    if (eventGroup?.orderedEventId !== null) {
        return 'Booked'
    }

    if (eventGroup.status === WALKIN) {
        return 'Walk-In'
    }

    return 'Available'
}

export function getDayGroupKey(group: DayGroupEvent): string {
    return [
        group.day,           // e.g. "monday"
        group.startTime,     // e.g. "10:00"
        ...group.eventIds,   // stable IDs
    ].join('|');
}

export function groupEventHash(eventIds: string[]): string {
    return eventIds.slice().sort().join("|");
}

export function isGroupEventActive(
    groupEventState: GroupEventInfoState,
    eventGroup: DayGroupEvent
): boolean {
    if (!groupEventState.activeGroupEventHash) return false;
    return (
        groupEventState.activeGroupEventHash ===
        groupEventHash(eventGroup.eventIds)
    );
}