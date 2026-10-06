import { useActivityContext } from '../activity/Context/useActivityContext.ts';
import { readWidgetConfig } from '../Config.ts';
import { WidgetCreatelisting } from '../components/WidgetCreatelisting.tsx';

type Props = { contract: unknown; runtime: unknown };
export default function WidgetWrapper({ contract, runtime }: Props) {
    const activity = useActivityContext();
    const config = readWidgetConfig(contract, runtime, activity);
    return <WidgetCreatelisting config={config} />;
}
