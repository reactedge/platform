import {useRef, useState} from "react";
import {type WidgetConfig} from "../ExplainerConfig";
import {useExplainerTrigger} from "../hooks/useExplainerTrigger.tsx";
import {useExplainerDismiss} from "../hooks/useExplainerDismiss.tsx";
import {Overlay} from "./Overlay.tsx";

type Props = {
    config: WidgetConfig
};

export const ExplainerWidget = ({ config }: Props) => {
    const [open, setOpen] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useExplainerTrigger(config.binding?.trigger, setOpen);
    useExplainerDismiss(open, cardRef, setOpen);

    if (!open) return null;

    return <div ref={cardRef} role="tooltip">
        <Overlay
            open={open}
            setOpen={setOpen}
            data={config.data}
        />

    </div>
};

