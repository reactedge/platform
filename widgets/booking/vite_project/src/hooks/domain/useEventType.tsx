// domain/hooks/useEventTypeGroups.ts
import {useKeystoneEventType} from "../infra/useKeystoneEventType.tsx";

export function useEventType(eventTypeId: string) {
    const {
        keystoneEventType,
        loading: eventTypeLoading,
        error: eventTypeError,
        refetch,
    } = useKeystoneEventType(eventTypeId);

    const eventType = keystoneEventType
        ? {
            id: keystoneEventType.id,
            label: keystoneEventType.name,
            description: keystoneEventType.description || '',
            duration: keystoneEventType.duration
        }
        : undefined;

    return {
        eventType,
        eventTypeLoading,
        eventTypeError,
        refetch,
    };
}