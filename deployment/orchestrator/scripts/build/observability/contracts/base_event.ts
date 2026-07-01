export interface EventSource {
    service: string;
    component: string;
}

export interface BaseEvent {
    eventType: string;
    eventVersion: string;
    timestamp: string;
    source: EventSource;
    payload: Record<string, unknown>;
}

export interface WidgetBuildCompletedEvent
    extends BaseEvent {}

export function buildBaseEvent(
    eventType: string,
    payload: Record<string, unknown>,
    source: EventSource
): BaseEvent {
    return {
        eventType,
        eventVersion: '1.0',
        timestamp: new Date().toISOString(),
        source,
        payload
    };
}