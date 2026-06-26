import type {EventHostIds} from "../../../types/domain/types.ts";
import {AVAILABLE, type EventFilterState} from "../../../types/domain/event.type.ts";
import {getDayTimeEnd, maxDate} from "../../../lib/date.ts";

interface BuildEventFilterParams {
    weekStart?: string;
    eventTypeId: string | null;
    venueId: string;
    eventHostIds: EventHostIds;
}

export function buildEventFilter(params: BuildEventFilterParams) {
    const filter: EventFilterState = {
        status: { equals: AVAILABLE },
    };

    if (!params.weekStart) return filter;

    if (params.venueId) {
        filter.venue = { id: { equals: params.venueId } };
    }

    const weekStartDate = new Date(params.weekStart);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    const endWeek = getDayTimeEnd(weekEndDate);

    const effectiveStart = maxDate(weekStartDate, new Date());

    filter.startTime = { gte: effectiveStart };
    filter.endTime = { lte: endWeek };

    if (params.eventTypeId
        && (params?.eventHostIds && params?.eventHostIds?.length > 0)
    ) {
        filter.eventHost = { id: { in: params.eventHostIds } };
    }

    return filter;
}
