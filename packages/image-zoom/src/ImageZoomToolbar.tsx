import type { useImageZoom } from "./useImageZoom.ts";

type Props = {
    title: string;
    titleId: string;
    zoom: ReturnType<typeof useImageZoom>;
    onClose: () => void;
    onPrevious?: (() => void) | undefined;
    onNext?: (() => void) | undefined;
    closeDataAttribute?: string;
};

export const ImageZoomToolbar = ({
    title,
    titleId,
    zoom,
    onClose,
    onPrevious,
    onNext,
    closeDataAttribute,
}: Props) => (
    <header className="imagezoom__toolbar">
        <h2 id={titleId} data-imagezoom-title>{title}</h2>
        <div className="imagezoom__controls" aria-label="Image controls">
            {onPrevious && (
                <button
                    type="button"
                    className="imagezoom__control"
                    aria-label="Previous image"
                    title="Previous image"
                    onClick={onPrevious}
                    data-gallery-prev
                >
                    <span aria-hidden="true">←</span>
                </button>
            )}
            {onNext && (
                <button
                    type="button"
                    className="imagezoom__control"
                    aria-label="Next image"
                    title="Next image"
                    onClick={onNext}
                    data-gallery-next
                >
                    <span aria-hidden="true">→</span>
                </button>
            )}
            <span className="imagezoom__divider" aria-hidden="true" />
            <button
                type="button"
                className="imagezoom__control"
                aria-label="Move image left"
                title="Move left"
                onClick={() => zoom.panBy(-48, 0)}
                disabled={zoom.scale === 1}
                data-imagezoom-pan-left
            >
                <span aria-hidden="true">⇤</span>
            </button>
            <button
                type="button"
                className="imagezoom__control"
                aria-label="Move image up"
                title="Move up"
                onClick={() => zoom.panBy(0, -48)}
                disabled={zoom.scale === 1}
                data-imagezoom-pan-up
            >
                <span aria-hidden="true">↑</span>
            </button>
            <button
                type="button"
                className="imagezoom__control"
                aria-label="Move image down"
                title="Move down"
                onClick={() => zoom.panBy(0, 48)}
                disabled={zoom.scale === 1}
                data-imagezoom-pan-down
            >
                <span aria-hidden="true">↓</span>
            </button>
            <button
                type="button"
                className="imagezoom__control"
                aria-label="Move image right"
                title="Move right"
                onClick={() => zoom.panBy(48, 0)}
                disabled={zoom.scale === 1}
                data-imagezoom-pan-right
            >
                <span aria-hidden="true">⇥</span>
            </button>
            <span className="imagezoom__divider" aria-hidden="true" />
            <button
                type="button"
                className="imagezoom__control imagezoom__zoom-button"
                aria-label="Zoom out"
                title="Zoom out"
                onClick={zoom.zoomOut}
                disabled={zoom.scale === 1}
                data-imagezoom-zoom-out
            >
                <span aria-hidden="true">−</span>
            </button>
            <output className="imagezoom__scale" aria-live="polite" data-imagezoom-scale>
                {Math.round(zoom.scale * 100)}%
            </output>
            <button
                type="button"
                className="imagezoom__control imagezoom__zoom-button"
                aria-label="Zoom in"
                title="Zoom in"
                onClick={zoom.zoomIn}
                disabled={zoom.scale === 4}
                data-imagezoom-zoom-in
            >
                <span aria-hidden="true">+</span>
            </button>
            <button
                type="button"
                className="imagezoom__reset"
                onClick={zoom.reset}
                disabled={zoom.scale === 1 && zoom.offset.x === 0 && zoom.offset.y === 0}
                data-imagezoom-reset
            >
                Reset
            </button>
            <button
                type="button"
                className="imagezoom__close"
                aria-label="Close image zoom"
                onClick={onClose}
                data-imagezoom-close
                data-gallery-minify={closeDataAttribute ? "" : undefined}
            >
                <span aria-hidden="true">×</span>
            </button>
        </div>
    </header>
);