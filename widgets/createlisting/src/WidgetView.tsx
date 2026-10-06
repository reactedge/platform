import { readWidgetConfig } from './Config.ts';
import { WidgetCreatelisting } from './components/WidgetCreatelisting.tsx';

export const WidgetView = ({ contract, runtime }: { contract: unknown; runtime: unknown }) =>
    <WidgetCreatelisting config={readWidgetConfig(contract, runtime)} />;
