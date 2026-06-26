// domain/hooks/useEventTypeGroups.ts

import {useKeystoneEventTypeGroups} from "../infra/useKeystoneEventTypeGroups.tsx";

export function useEventTypeGroups(venueId?: string) {
    const {
        keystoneEventTypeGroups,
        keystoneEventTypeLoading,
        keystoneEventTypeError,
        refetch,
    } = useKeystoneEventTypeGroups(venueId);

    const groups = keystoneEventTypeGroups? keystoneEventTypeGroups.map((group) => ({
        id: group.id,
        label: group.name,
        description: ''
    })) : undefined;

    return {
        groups,
        eventTypeGrouploading: keystoneEventTypeLoading,
        eventTypeGroupError: keystoneEventTypeError,
        refetch,
    };
}