import {useVisitIntentState} from "../../../state/Intent/useVisitIntentState.ts";
import {Spinner} from "../../global/Spinner.tsx";
import {ErrorState} from "../../global/ErrorState.tsx";
import {useEvents} from "../../../hooks/domain/useEvents.ts";
import {NoEvent} from "./NoEvent.tsx";
import {WeekEvents} from "./WeekEvents.tsx";
import {useConfigState} from "../../../state/Config/useConfigState.ts";
import {useMemo} from "react";
import {useDashboardState} from "../../../state/Dashboard/useDashboardState.ts";
import type {Venue} from "../../../types/domain/types.ts";
import {activity} from "../../../activity";
import {GroupEventStateProvider} from "../../../state/GroupEvent/GroupEventStateProvider.tsx";
import {EventStateProvider} from "../../../state/Event/EventStateProvider.tsx";

export function GetWeekEvents() {
    const { visitIntent } = useVisitIntentState();
    const { config, getEventHostIds } = useConfigState();
    const { dashboardState } = useDashboardState();

    const venue = config?.venue as Venue

    const ready =
        visitIntent.eventTypeId !== null &&
        visitIntent.weekIntent !== null;

    const hostsIds = useMemo(
        () => visitIntent.hostId ? [visitIntent.hostId] : getEventHostIds(),
        [visitIntent.hostId, getEventHostIds]
    );

    const {
        events,
        eventsLoading,
        eventsError,
    } = useEvents(
        ready
            ? {
                eventTypeId: visitIntent.eventTypeId,
                weekStart: visitIntent.weekIntent,
                venueId: venue.id,
                eventHostIds: hostsIds,
            }
            : undefined,
        dashboardState.versionNumber
    );

    if (!ready || eventsLoading) {
        return <Spinner />;
    }

    if (eventsError) {
        return <ErrorState />;
    }

    activity('event-load', 'Week Event Data',{weekEventsNumber: events?.length});

    if (!events || events.length === 0) {
        return <NoEvent />;
    }

    return <GroupEventStateProvider>
            <EventStateProvider>
                <WeekEvents events={events} />
            </EventStateProvider>
        </GroupEventStateProvider>;
}
