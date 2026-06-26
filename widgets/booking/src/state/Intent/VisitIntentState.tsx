import {createContext} from "react";
import type {VisitIntentInfoState, VisitIntentState} from "./type.ts";

export const initialVisitIntent: VisitIntentInfoState = { weekIntent: "", eventTypeId: "", eventTypeGroupId: "", hostId: "" }

export const readVisitIntent = (): VisitIntentInfoState => {
    if (typeof window === "undefined") {
        return initialVisitIntent;
    }

    try {
        const storedData = JSON.parse(localStorage.getItem("visitIntent") || "{}");
        return {
            weekIntent: storedData.weekIntent || "",
            eventTypeId: storedData.eventTypeId || "",
            eventTypeGroupId: storedData.eventTypeGroupId || "",
            hostId: storedData.hostId,
        };
    } catch (error) {
        console.log(error)
        return initialVisitIntent;
    }
};

export const LocalVisitIntentStateContext = createContext<VisitIntentState | undefined>(undefined);