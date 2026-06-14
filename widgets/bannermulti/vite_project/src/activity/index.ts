import { isActivityEnabled } from './activity.guard';

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

export interface Activity {
    log(
        phase: string,
        message: string,
        data?: unknown,
        level?: Level
    ): void;
}

export class WidgetActivity
    implements Activity {

    private readonly widget: string;
    private readonly instance?: string;

    constructor(
        widget: string,
        instance?: string
    ) {
        this.widget = widget;
        this.instance = instance;
    }

    public log(
        phase: string,
        message: string,
        data?: unknown,
        level: Level = 'info'
    ): void {

        const payload: ActivityPayload = {
            widget: this.widget,
            instance: this.instance ?? this.widget,
            phase,
            message,
            level,
            data,
            ts: Date.now(),
        };

        if (isActivityEnabled()) {
            const prefix =
                `[${this.widget}] ${phase}`;

            if (level === 'error') {
                console.error(prefix, payload);
            } else if (level === 'warn') {
                console.warn(prefix, payload);
            } else {
                console.log(prefix, payload);
            }

            this.dispatchActivityEvent(payload);
        }
    }

    private dispatchActivityEvent(
        payload: ActivityPayload
    ): void {

        if (typeof window === 'undefined') {
            return;
        }

        window.dispatchEvent(
            new CustomEvent(
                'reactedge:activity',
                {
                    detail: payload,
                }
            )
        );
    }
}
