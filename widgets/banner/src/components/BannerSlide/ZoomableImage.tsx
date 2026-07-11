import {useZoomPan} from "../../hooks/useZoomPan.ts";

type Props = {
    src: string;
    srcSet?: string;
    sizes?: string;
    alt?: string;
    objectPosition?: string;
    className?: string;
};

export const ZoomableImage = ({
      src,
      srcSet,
      sizes,
      alt,
      objectPosition,
      className
  }: Props) => {
    const {
        transform,
        handleClick,
        handleMove,
        handleLeave
    } = useZoomPan();

    return (
        <div
            className="re-zoom-container"
            onClick={handleClick}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
        >
            <img
                src={src}
                srcSet={srcSet}
                sizes={sizes}
                alt={alt || ""}
                className={className}
                style={{
                    ...(objectPosition ? { objectPosition } : {}),
                    transform
                }}
            />
        </div>
    );
};