import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import { ImageZoomToolbar } from "./ImageZoomToolbar.tsx";
import { useImageZoom } from "./useImageZoom.ts";

export type ZoomableImage = {
    src: string;
    alt?: string;
};

type Props = {
    image: ZoomableImage;
    title: string;
    open: boolean;
    onClose: () => void;
    onPrevious?: (() => void) | undefined;
    onNext?: (() => void) | undefined;
};

export const ImageZoomDialog = ({
    image,
    title,
    open,
    onClose,
    onPrevious,
    onNext,
}: Props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const titleId = useId();
    const zoom = useImageZoom(stageRef);
    const resetZoom = useEffectEvent(zoom.reset);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        else if (!open && dialog.open) dialog.close();
    }, [open]);

    useEffect(() => {
        setImageLoaded(false);
        setImageError(false);
        resetZoom();
    }, [image.src]);

    const handleClose = () => {
        zoom.reset();
        onClose();
    };

    if (!open) return null;

    return (
        <dialog
            className="imagezoom__dialog"
            ref={dialogRef}
            aria-labelledby={titleId}
            onClose={handleClose}
            onClick={event => {
                if (event.target === event.currentTarget) dialogRef.current?.close();
            }}
            data-imagezoom-dialog
            data-gallery-zoom
        >
            <div className="imagezoom__modal">
                <ImageZoomToolbar
                    title={title}
                    titleId={titleId}
                    zoom={zoom}
                    onClose={() => dialogRef.current?.close()}
                    onPrevious={onPrevious}
                    onNext={onNext}
                    closeDataAttribute="data-gallery-minify"
                />
                <div
                    className={`imagezoom__stage${zoom.scale > 1 ? " is-zoomed" : ""}`}
                    ref={stageRef}
                    onPointerDown={zoom.startPan}
                    onPointerMove={zoom.movePan}
                    onPointerUp={zoom.stopPan}
                    onPointerCancel={zoom.stopPan}
                    onLostPointerCapture={zoom.stopPan}
                    data-imagezoom-stage
                >
                    {!imageLoaded && !imageError && (
                        <p className="imagezoom__status" role="status">Loading image…</p>
                    )}
                    {imageError ? (
                        <p className="imagezoom__status" role="alert">This image could not be loaded.</p>
                    ) : (
                        <img
                            key={image.src}
                            className={`imagezoom__image${imageLoaded ? " is-loaded" : ""}`}
                            src={image.src}
                            alt={image.alt ?? ""}
                            draggable="false"
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                            style={{
                                transform: `translate(${zoom.offset.x}px, ${zoom.offset.y}px) scale(${zoom.scale})`,
                            }}
                            data-imagezoom-image
                            data-gallery-main
                        />
                    )}
                </div>
            </div>
        </dialog>
    );
};