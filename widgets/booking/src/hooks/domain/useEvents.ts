// domain/hooks/useEvents.ts

import type {EventFilterState, IntentEvent, KeystoneEventFilter} from "../../types/domain/event.type.ts";
import type {FilterParams} from "../../types/domain/types.ts";
import {useFilter} from "./useFilter.tsx";
import {useKeystoneEvents} from "../infra/useKeystoneEvents.tsx";
import {mapKeystoneEvent} from "../infra/mappers/mapKeystoneEvent.ts";

interface UseEventsResult {
    events: IntentEvent[] | undefined;
    eventsLoading: boolean;
    eventsError: Error | null;
    refetch: (filter: KeystoneEventFilter) => void;
}

export function useEvents(params: FilterParams | undefined, versionNumber: number): UseEventsResult {
    const filter = useFilter(params) as EventFilterState

    const {
        keystoneEvents,
        loading,
        error,
        refetch,
    } = useKeystoneEvents(filter, versionNumber);

    const events = keystoneEvents ? keystoneEvents.map(mapKeystoneEvent)
        : undefined;

    return {
        events,
        eventsLoading: loading,
        eventsError: error,
        refetch,
    };
}
