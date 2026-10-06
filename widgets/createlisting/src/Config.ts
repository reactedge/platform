import { parseConfig, type SchemaWidgetConfig } from './ConfigSchema.ts';
import type { WidgetActivity } from '@reactedge/framework/activity';

export type WidgetConfig = SchemaWidgetConfig;
export type ReactEdgeRuntimeConfig = Record<string, unknown>;
export const WIDGET_ID = 'createlisting';

export function readWidgetConfig(contract: unknown, _runtime?: unknown, activity?: WidgetActivity): WidgetConfig {
    const config = parseConfig(contract);
    activity?.log('bootstrap', 'Config resolved', config);
    return Object.freeze(config);
}
