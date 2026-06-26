import type {DayGroupEvent} from "../../types/domain/dashboard.type.tsx";

export const isPastEvent = (eventGroup: DayGroupEvent) => {
    const date = new Date()
    const eventDate = new Date(eventGroup?.startTime)
    return eventDate < date
}