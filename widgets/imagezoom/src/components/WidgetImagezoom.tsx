import { useState } from "react";
import type { WidgetConfig } from "../Config";
import { ImageZoomDialog } from "reactedge-image-zoom";

type Props = {
    config: WidgetConfig;
};

export const WidgetImagezoom = ({ config }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="imagezoom" aria-label={config.data.title}>
            <button
                className="imagezoom__preview"
                type="button"
                aria-label={`Open image zoom: ${config.data.image.alt}`}
                aria-haspopup="dialog"
                onClick={() => setIsOpen(true)}
                data-imagezoom-open
            >
                <img src={config.data.image.src} alt={config.data.image.alt} loading="lazy" />
                <span className="imagezoom__preview-action" aria-hidden="true">
                    <span className="imagezoom__magnifier">+</span>
                    Zoom image
                </span>
            </button>

            <ImageZoomDialog
                image={config.data.image}
                title={config.data.title}
                open={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </section>
    );
};