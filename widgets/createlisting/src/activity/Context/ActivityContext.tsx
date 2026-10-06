import {createContext} from "react";
import type {WidgetActivity} from "@reactedge/framework/activity";

export const LocalInstanceStateContext = createContext<WidgetActivity | undefined>(undefined);