import {getTracer, setupTelemetry, SEVICE_NAME} from "./telemetry.ts";

export type ActivityEvent =
    CustomEvent<ActivityPayload>;

type Level = 'info' | 'warn' | 'error';
export interface ActivityPayload {
    widget: string;
    instance: string;
    phase: string;
    message: string;
    level: Level;
    data?: unknown;
    ts: number;
}


export function startObservability() {
    setupTelemetry();

    window.addEventListener(
        SEVICE_NAME,
        (event) => {
            const payload =
                (event as ActivityEvent).detail;

            const span = getTracer().startSpan(
                `widget.${payload.widget}.${payload.phase}`
            );

            span.setAttributes({
                'reactedge.widget': payload.widget,
                'reactedge.instance': payload.instance,
                'reactedge.phase': payload.phase,
                'reactedge.level': payload.level,
                'reactedge.message': payload.message
            });

            span.end();
        }
    );
}

interface WidgetContext {
    widget: string;
    instance: string;
}

const instances = new WeakMap<HTMLElement, WidgetContext>();

export function registerInstance(
    element: HTMLElement,
    context: WidgetContext
) {
    instances.set(element, context);
}

export function getInstance(
    element: HTMLElement
): WidgetContext | undefined {
    return instances.get(element);
}