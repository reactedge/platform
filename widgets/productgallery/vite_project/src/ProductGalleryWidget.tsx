import { useState } from "react";
import { ProductTiledGallery } from "./components/ProductTiledGallery";
import { ProductGallery } from "./components/ProductGallery";
import {useWidgetConfig} from "./hooks/useWidgetConfig.ts";

type Props = {
    host: HTMLElement
}

export default function ProductGalleryWidget({host}: Props) {
    const config = useWidgetConfig(host);

    if (!config) return null;

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

            {/* Render the selected component */}
            {mode === "tiled" ? <ProductTiledGallery tiles={config.tiles} /> : <ProductGallery tiles={config.tiles} />}
        </div>
    );
}
