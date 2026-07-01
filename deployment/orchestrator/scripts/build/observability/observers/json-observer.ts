import {ReportEntry} from "../../report.ts";
import {ReportObserver} from "./report-observer.ts";
import {BaseEvent} from "../contracts/base_event.ts";

export class JsonObserver
    implements ReportObserver {

    notify(
        entry: BaseEvent
    ): void {

        // persist to json file
    }
}