import {createContext} from "react";
import type {EventInfoState, EventState} from "./type.ts";

export const intialState: EventInfoState = {
    activeEventId: '',
    shampoo: false,
    drawerContent: 'booking'
}

export const readActiveEvent = (): EventInfoState => {
    if (typeof window === "undefined") {
        return intialState;
    }

    try {
        const storedData = JSON.parse(localStorage.getItem("eventState") || "{}");
        return {
            activeEventId: storedData.activeEventId || "",
            shampoo: storedData.shampoo || false,
            drawerContent: 'booking'
        };
    } catch (error) {
        console.log(error)
        return intialState;
    }
};

export const LocalEventStateContext = createContext<EventState | undefined>(undefined);