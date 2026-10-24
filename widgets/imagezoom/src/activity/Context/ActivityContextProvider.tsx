import {type ReactNode} from "react";
import {WIDGET_ID} from "../../Config.ts";
import {LocalInstanceStateContext} from "./ActivityContext.tsx";
import {WidgetActivity} from "@reactedge/framework/activity";

interface InstanceStateProviderProps {
    children: ReactNode;
    hostElement?: HTMLElement;
}

const LocalStateProvider = LocalInstanceStateContext.Provider;

export const ActivityContextProvider: React.FC<InstanceStateProviderProps> = ({
         children,
         hostElement
     }) => {

    const host = hostElement ?? document.documentElement;

    const activity = new WidgetActivity(WIDGET_ID, host.dataset.instance)

    return (
        <LocalStateProvider
            value={
                activity
            }
        >
            {children}
        </LocalStateProvider>
    );
};
