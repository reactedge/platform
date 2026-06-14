import {Card} from "./Card.tsx";
import type {CardData} from "../ExplainerConfig.ts";

type Props = {
    open: boolean,
    setOpen: (open: boolean) => void,
    data: CardData
};
export function Overlay({open, setOpen, data}: Props) {
    const close = () => {
        setOpen(false)
    }

    if (!open) return null;

    return (
        <div
            className="re-explainer-overlay"
            role="dialog"
            aria-modal="true"
        >
            <div className="re-explainer-overlay-content" onClick={close}>
                <Card data={data} close={close} />
            </div>
        </div>
    )
}