import {useContext} from "react";
import {LocalInstanceStateContext} from "./ActivityContext.tsx";
import type {WidgetActivity} from "@reactedge/framework/activity";

export function useActivityContext(): WidgetActivity {
    const context = useContext(LocalInstanceStateContext);
    if (!context) {
        throw new Error("useInstanceState must be used within InstanceStateProvider");
    }
    return context;
}