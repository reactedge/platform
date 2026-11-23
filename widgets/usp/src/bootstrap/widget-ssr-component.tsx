import {WidgetView} from "./view/WidgetView.tsx";
interface WidgetRootProps {
    contract: unknown;
    hostElement?: HTMLElement;
}

export function WidgetComponent({
       contract
   }: WidgetRootProps) {
    return <WidgetView contract={contract} />;
}
