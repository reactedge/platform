import type {EventHost, EventHostIndex} from "../../types/domain/event.type.ts";

export function getEventHostIdsForEventType(
    eventTypeId: string,
    eventHosts: EventHostIndex[] = []
): string[] {
    return eventHosts
        .filter(host => host.eventTypeId === eventTypeId)
        .map(host => host.id);
}

export function getEventHostDetail(
    eventHosts: EventHost[],
    eventHostId: string
): EventHost | undefined {
    return eventHosts.find(host => host.id === eventHostId);
}