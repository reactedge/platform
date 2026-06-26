import {useContext} from "react";
import type {WidgetActivity} from "../index.ts";
import {LocalInstanceStateContext} from "./ActivtiyContext.tsx";

export function useActivityContext(): WidgetActivity {
    const context = useContext(LocalInstanceStateContext);
    if (!context) {
        throw new Error("useInstanceState must be used within InstanceStateProvider");
    }
    return context;
}