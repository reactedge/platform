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
    return (
        <div
            className="re-zoom-container"
        >
            <img
                src={src}
                srcSet={srcSet}
                sizes={sizes}
                alt={alt || ""}
                className={className}
                style={{
                    ...(objectPosition ? { objectPosition } : {})
                }}
            />
        </div>
    );
};