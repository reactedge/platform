import { renderToString } from 'react-dom/server';
import { WidgetView } from '../WidgetView.tsx';
import type { ReactEdgeRuntimeConfig } from '../Config.ts';

export const renderHtml = (config: unknown, runtime: ReactEdgeRuntimeConfig): string =>
    renderToString(<WidgetView contract={config} runtime={runtime} />);

export async function buildBootstrap() { return {}; }
export async function loadRuntime(): Promise<ReactEdgeRuntimeConfig> { return {}; }
