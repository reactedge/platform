import React from "react";
import {useConfigState} from "../../../../state/Config/useConfigState.ts";
import type {DayGroupEvent} from "../../../../types/domain/dashboard.type.tsx";
import {capitalise} from "../../../../lib/string.ts";
import {getEventHostDetail} from "../../../../domain/eventHost/eventHosts.ts";

interface ListingProps {
    eventGroup: DayGroupEvent
}

export const EventHostView: React.FC<ListingProps> = ({ eventGroup }) => {
    const {config} = useConfigState();

    if (config.eventHosts.length === 1) return ;

    const getKey = (startTime: string, eventHost: string) => {
        const date = new Date(startTime).getTime();
        return `${date}-${eventHost}`;
    };

    return (
        <div className="event-host-view">
            <div className="event-host-list">
                {eventGroup.eventHosts.map(
                    ({ eventId, eventHostId }) => {
                        const eventHost = getEventHostDetail(
                            config?.eventHosts,
                            eventHostId
                        );

                        if (
                            eventGroup.cartEvent &&
                            eventGroup.cartEvent.id !== eventId
                        )
                            return null;

                        if (eventGroup.orderedEventId === eventId)
                            return null;

                        return (
                            <div
                                key={getKey(
                                    eventGroup.startTime,
                                    eventHostId
                                )}
                                className="event-host-item"
                            >
                                <label
                                    htmlFor="eventHost"
                                    className="event-host-label"
                                >
                                    {capitalise(eventHost?.name)}
                                </label>
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
};