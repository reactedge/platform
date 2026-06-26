import {getDays} from "../../../lib/date.ts";
import {getDayEventsForDay} from "../../../domain/booking";
import {NoDayEventList} from "./DayEvent/NoDayEventList.tsx";
import {DayEventGroup} from "./DayEvent/DayEventGroup.tsx";
import type {IntentEvent} from "../../../types/domain/event.type.ts";
import {useUserState} from "../../../state/User/useUserState.ts";
import {useMediaQuery} from "../../../hooks/ui/useMediaQuery.tsx";
import type {DayGroupEvent} from "../../../types/domain/dashboard.type.tsx";
import {useGroupEventState} from "../../../state/GroupEvent/useGroupEventState.ts";
import {useEventState} from "../../../state/Event/useEventState.ts";
import {useEffect, useRef} from "react";

interface WeekEventProps {
    events: IntentEvent[];
}

export function WeekEvents({ events }: WeekEventProps) {
    const { user } = useUserState();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { toggleActiveGroupEvent } = useGroupEventState();
    const { showBooking } = useEventState()

    const prevUserRef = useRef<typeof user>(null);

    useEffect(() => {
        // Auth boundary: unauthenticated → authenticated
        if (!prevUserRef.current && user) {
            showBooking();
        }

        prevUserRef.current = user;
    }, [user, showBooking]);

    return (
        <div
            className="week-event-list"
            data-layout={isMobile ? 'mobile' : 'desktop'}
        >
            {getDays().map((day) => {
                const dayEventList = getDayEventsForDay(day, events, user);

                return (
                    <div key={day.day} className={`week-event-day ${
                                dayEventList.length === 0 ? 'week-event-day--empty' : ''
                            }`}>
                        <h4 className="week-event-day-title">{day.dayLabel}</h4>

                        {dayEventList.length > 0 ? (
                            <div className="week-event-day-groups">
                                {dayEventList.map(
                                    (eventGroup: DayGroupEvent, index: number) => (
                                        <DayEventGroup
                                            key={index}
                                            eventGroup={eventGroup}
                                            onView={(eventIds) => {
                                                toggleActiveGroupEvent(eventIds);
                                                showBooking()
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        ) : (
                            <NoDayEventList/>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

