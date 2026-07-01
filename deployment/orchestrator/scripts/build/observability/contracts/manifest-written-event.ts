import {BaseEvent, buildBaseEvent} from "./base_event.ts";

export interface ManifestWrittenEvent extends BaseEvent {
    eventType: 'manifest-written';

    payload: {
        widget: string;
        manifestFile: string;
    };
}

export function buildManifestWrittenEvent(
    widget: string,
    manifestFile: string
): ManifestWrittenEvent {

    return buildBaseEvent(
        'manifest-written',
        {
            widget,
            manifestFile
        },
        {
            service: 'reactedge-build',
            component: 'manifest-writer'
        }
    ) as ManifestWrittenEvent;
}