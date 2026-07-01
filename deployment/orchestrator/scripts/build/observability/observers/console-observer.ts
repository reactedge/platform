import type {ReportObserver} from "./report-observer.ts";
import type {BaseEvent} from "../contracts/base_event.ts";

export class ConsoleObserver
    implements ReportObserver {

    notify(
        event: BaseEvent
    ): void {

        console.log(
            `[${event.eventType}]`
        );

        for (const [key, value] of Object.entries(event.payload)) {
            console.log(
                `  ${key}: ${value}`
            );
        }
    }
}