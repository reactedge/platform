import { useVisitIntentState } from "../../state/Intent/useVisitIntentState.ts";
import {GetWeekEvents} from "./Dashboard/GetWeekEvents.tsx";
import {DashboardStateProvider} from "../../state/Dashboard/DashboardStateProvider.tsx";

export function EventDashboard(){
    const { visitIntent } = useVisitIntentState();

    if (!visitIntent.eventTypeId || !visitIntent.weekIntent) {
        return null;
    }

    return <DashboardStateProvider>
        <GetWeekEvents />
    </DashboardStateProvider>
};
