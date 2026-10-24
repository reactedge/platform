import { useRef } from "react";
import type { CSSProperties } from "react";
import type { WidgetConfig } from "../Config";
import { SizeguideContent } from "./SizeguideContent.tsx";

type Props = {
    config: WidgetConfig;
};

export const WidgetSizeguide = ({ config }: Props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <div className="sizeguide-launcher">
            <button
                className="sizeguide__open-button"
                type="button"
                aria-haspopup="dialog"
                onClick={() => dialogRef.current?.showModal()}
                style={{ "--sizeguide-accent": config.settings.accentColour } as CSSProperties}
                data-sizeguide-open
            >
                Size guide
            </button>
            <dialog
                className="sizeguide__dialog"
                ref={dialogRef}
                aria-labelledby="sizeguide-title"
                data-sizeguide-dialog
            >
                <button
                    className="sizeguide__close-button"
                    type="button"
                    aria-label="Close size guide"
                    onClick={() => dialogRef.current?.close()}
                    data-sizeguide-close
                >
                    <span aria-hidden="true">&times;</span>
                </button>
                <SizeguideContent config={config} />
            </dialog>
        </div>
    );
};
