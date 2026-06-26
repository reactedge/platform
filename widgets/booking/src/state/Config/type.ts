import type {EventTypeGroup, Venue} from "../../types/domain/types.ts";
import type {EventHost} from "../../types/domain/event.type.ts";

export interface ConfigInfoState {
    venue: Venue | undefined;
    eventHosts: EventHost[];
    eventTypeGroups: EventTypeGroup[];
}

export interface ConfigState {
    config: ConfigInfoState;
    setVenue: (value: Venue) => void;
    setEventHosts: (value: EventHost[]) => void;
    getEventHostIds: () => string[];
}