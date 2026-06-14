import {createContext} from "react";
import type {GroupEventState, GroupEventInfoState} from "./type.ts";

const intialState: GroupEventInfoState = {
    activeGroupEventHash: ''
}

export const readActiveGroupEvent = (): GroupEventInfoState => {
    if (typeof window === "undefined") {
        return intialState;
    }

    try {
        const storedData = JSON.parse(localStorage.getItem("eventGroupState") || "{}");
        return {
            activeGroupEventHash: storedData.activeGroupEventHash || ""
        };
    } catch (error) {
        console.log(error)
        return intialState;
    }
};

export const LocalGroupEventStateContext = createContext<GroupEventState | undefined>(undefined);