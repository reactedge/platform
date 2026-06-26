// domain/hooks/useEventTypeGroups.ts
import {useKeystoneVenue} from "../infra/useKeystoneVenue.tsx";
import {activity} from "../../activity";

export function useVenue(venueId: string) {
    activity('venue', 'Venue loaded', {venueId});
    const { keystoneVenue, loading, error, refetch } =
        useKeystoneVenue(venueId);

    const venue = keystoneVenue? {
        id: keystoneVenue.id,
        code: keystoneVenue.code,
        name: keystoneVenue.name
    }: undefined

    return {
        venue,
        venueLoading: loading,
        venueError: error,
        refetch,
    };
}
