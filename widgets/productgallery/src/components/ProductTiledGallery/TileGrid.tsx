import type {GalleryTile} from "../Types.ts";
import {cardStyle, galleryStyle, hiddenStyle, imgStyle, visibleStyle} from "./style.ts";

interface TileGridProps {
    tiles: GalleryTile[]
    onSelect: (index: number) => void;
}

export const TileGrid = ({ tiles, onSelect }: TileGridProps) => {
    return (
        <div style={galleryStyle} data-gallery-tiled>
            {tiles.map((tile, index) => {
                const isVisible = true;

                return (
                    <div
                        key={index}
                        style={{
                            ...cardStyle,
                            ...(isVisible ? visibleStyle : hiddenStyle)
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        onClick={() => onSelect(index)}
                    >
                        <img src={tile.src}
                             alt={tile.alt}
                             style={imgStyle}
                             data-gallery-tile
                        />
                    </div>
                );
            })}
        </div>
    )
};