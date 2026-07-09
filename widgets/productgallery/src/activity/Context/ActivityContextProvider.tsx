import {type ReactNode} from "react";
import {WIDGET_ID} from "../../Config.ts";
import {WidgetActivity} from "../index.ts";
import {LocalInstanceStateContext} from "./ActivtiyContext.tsx";

interface InstanceStateProviderProps {
    children: ReactNode;
    hostElement: HTMLElement;
}

const LocalStateProvider = LocalInstanceStateContext.Provider;

export const ActivityContextProvider: React.FC<InstanceStateProviderProps> = ({
         children,
         hostElement
     }) => {

    const activity = new WidgetActivity(WIDGET_ID, hostElement.dataset.instance)

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
