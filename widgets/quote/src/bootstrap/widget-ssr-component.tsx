import { WIDGET_ID } from "./config/Config.ts";
import { WidgetView } from "./view/WidgetView.tsx";

type Props = {
    contract: unknown;
    runtime: unknown;
};

export function WidgetComponent({ contract, runtime }: Props) {
    return (
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={contract} runtime={runtime} />
        </div>
    );
}
