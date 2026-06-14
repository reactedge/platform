// domain/hooks/useEvents.ts

import type {IntentEvent} from "../../types/domain/event.type.ts";
import {useKeystoneEventGroup} from "../infra/useKeystoneEventGroup.tsx";
import {mapKeystoneGroupEvent} from "../infra/mappers/mapKeystoneEvent.ts";

interface UseGroupEventsResult {
    groupEvents: IntentEvent[] | undefined;
    groupEventsLoading: boolean;
    groupEventsError: Error | null;
    refetch: (eventIds: string[]) => void;
}

export function useEventGroup(eventIds: string[]): UseGroupEventsResult {
    const {
        keystoneGroupEvents,
        loading,
        error,
        refetch,
    } = useKeystoneEventGroup(eventIds);

    const groupEvents = keystoneGroupEvents ? keystoneGroupEvents.map(mapKeystoneGroupEvent)
        : undefined;

    return {
        groupEvents,
        groupEventsLoading: loading,
        groupEventsError: error,
        refetch,
    };
}
