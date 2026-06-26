import {createContext} from "react";
import {WidgetActivity} from "../index.ts";

export const LocalInstanceStateContext = createContext<WidgetActivity | undefined>(undefined);