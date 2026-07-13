import type {WidgetConfig} from "./Types.ts";
import {useState} from "react";
import {ProductTiledGallery} from "./ProductTiledGallery.tsx";
import {ProductGallery} from "./ProductGallery.tsx";

type Props = {
    config: WidgetConfig
};

export const ProductGalleryWidget = ({ config }: Props) => {
    const [mode, setMode] = useState<"tiled" | "classic">("tiled");

    return (
        <div>
            {/* Switch Button */}
            <button
                className="switchButton"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#14619e")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1979c3")}
                onClick={() =>
                    setMode((prev) => (prev === "tiled" ? "classic" : "tiled"))
                }
                data-gallery-switch
            >
                Switch to {mode === "tiled" ? "Classic" : "Tiled"} View
            </button>

            {mode === "tiled" ? <ProductTiledGallery tiles={config.tiles} /> : <ProductGallery tiles={config.tiles} />}
        </div>
    );
};

