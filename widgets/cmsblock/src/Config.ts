import {parseConfig, type WidgetConfig as ParsedWidgetConfig} from './ConfigSchema.ts';
import type {WidgetActivity} from '@reactedge/framework/activity';

export type WidgetConfig = ParsedWidgetConfig;

export const WIDGET_ID = 'cmsblock';

/** CMSBlock is a static widget; editing will use a separate backend service. */
export function readWidgetConfig(
    rawContract: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const config = parseConfig(rawContract);
        activity?.log('bootstrap', 'Config resolved', config);
        return Object.freeze(config);
    } catch (error) {
        activity?.log(
            'bootstrap',
            'Invalid widget contract',
            error instanceof Error ? error.message : error,
            'error'
        );
        throw error;
    }
}
