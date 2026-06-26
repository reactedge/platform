import {SetEventDetail} from "./SetEventDetail.tsx";
import type {DayGroupEvent} from "../../../../types/domain/dashboard.type.tsx";
import {getTime} from "../../../../lib/date.ts";
import {useDashboardState} from "../../../../state/Dashboard/useDashboardState.ts";
import {EventHostView} from "./EventHostView.tsx";
import {useGroupEventState} from "../../../../state/GroupEvent/useGroupEventState.ts";
import {isGroupEventActive} from "../../../../domain/event/getGroupEventStatus.ts";
import {DrawerContent} from "../WeekEvents/DrawerContent.tsx";
import {BookingDrawer} from "../../../BookingDrawer.tsx";

interface ListingProps {
    eventGroup: DayGroupEvent;
    onView: (eventIds: string[]) => void;
}

export const DayEventGroup: React.FC<ListingProps> = ({ eventGroup, onView }) => {
    const { dashboardState } = useDashboardState();
    const { groupEventState, resetActiveGroupEvent } = useGroupEventState();

    const highlight = () => {
        if (dashboardState.lastBookedEventId === null) return false;
        return eventGroup.eventIds.indexOf(dashboardState.lastBookedEventId) > -1
    }

    return (
            <div className={`event-card${highlight() ? "--highlighting" : ""}`}>
                <div className="card-info-hidden">
                    {eventGroup.startTime}
                    {eventGroup.name}
                    {eventGroup.eventType}
                </div>
                <div className="event-card__time">
                    {getTime(eventGroup.startTime)}
                </div>

                <div className="event-card__host">
                    <EventHostView eventGroup={eventGroup}/>
                </div>

                <SetEventDetail eventGroup={eventGroup} onView={onView}/>
                {isGroupEventActive(groupEventState, eventGroup) && (
                    <BookingDrawer open={!!eventGroup.eventIds}
                            onClose={() => {
                                resetActiveGroupEvent();
                            }}
                        >
                        {eventGroup.eventIds && (
                            <DrawerContent eventIds={eventGroup.eventIds}/>
                        )}
                    </BookingDrawer>
                )}
            </div>
    );
};
