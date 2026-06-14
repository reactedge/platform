import {useConfigState} from "../../../../state/Config/useConfigState.ts";
import type {DayGroupEvent} from "../../../../types/domain/dashboard.type.tsx";
import {useEventState} from "../../../../state/Event/useEventState.ts";
import {capitalise} from "../../../../lib/string.ts";

interface ListingProps {
    eventGroup: DayGroupEvent
}

export const EventHostSelect: React.FC<ListingProps> = ({ eventGroup }) => {
    const { eventState, toggleActiveEvent } = useEventState();
    const { config } = useConfigState();

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        toggleActiveEvent(e.target.value);
    };

    return (
        <div className="event-host-select">
            {eventGroup.eventHosts.map(({ eventHostId, eventId }) => {
                const host = config.eventHosts.find(h => h.id === eventHostId);

                if (!host) return null;

                return (
                    <label
                        key={eventId}
                        className="event-host-select__option"
                    >
                        <input
                            type="radio"
                            name="eventHost"
                            value={eventId}
                            checked={eventState.activeEventId === eventId}
                            onChange={handleSelect}
                            className="event-host-select__input"
                        />

                        <span className="event-host-select__label">
                          {capitalise(host.name)}
                        </span>
                    </label>
                );
            })}
        </div>
    );
};
