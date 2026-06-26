// domain/hooks/useEventTypeGroups.ts
import {useKeystoneEventHosts} from "../infra/useKeystoneEventHosts.tsx";

import { useMemo } from "react";

export function useEventHosts(venueId?: string) {
    const {
        keystoneEventHosts,
        loading: hostsLoading,
        error: hostsError,
        refetch,
    } = useKeystoneEventHosts(venueId);

    const eventHosts = useMemo(
        () => keystoneEventHosts,
        [keystoneEventHosts]
    );

    const eventHostIds = useMemo(
        () => eventHosts?.map(host => host.id) ?? [],
        [eventHosts]
    );

    return {
        eventHosts,
        eventHostIds,
        hostsLoading,
        hostsError,
        refetch,
    };
}
