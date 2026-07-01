import type {BaseEvent} from "../contracts/base_event.ts";
import type {Span} from "@opentelemetry/api";

export interface ReportObserver {
    notify(entry: BaseEvent, span?: Span): void;
}
