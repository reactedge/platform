// domain/hooks/useEventTypeGroups.ts
import {useKeystoneEventTypes} from "../infra/useKeystoneEventTypes.tsx";

export function useEventTypes(groupId: string) {
    const {
        keystoneEventTypes,
        loading: eventTypesLoading,
        error: eventTypesError,
        refetch,
    } = useKeystoneEventTypes(groupId);

    const eventTypes = keystoneEventTypes? keystoneEventTypes.map((eventType) => ({
        id: eventType.id,
        label: eventType.name,
        description: eventType?.description || '',
        duration: eventType.duration
    })): undefined;

    return {
        eventTypes,
        eventTypesLoading,
        eventTypesError,
        refetch,
    };
}