import type {WidgetConfig} from "./Types.ts";
import {useState} from "react";
import {ProductTiledGallery} from "./ProductTiledGallery.tsx";
import {ProductGallery} from "./ProductGallery.tsx";
import {SpinnerOverlay} from "./global/SpinnerOverlay.tsx";
import {useGalleryData} from "../hooks/domain/useGalleryData.tsx";
import type {BootstrapData} from "../ssr/entry.tsx";

type Props = {
    config: WidgetConfig
    bootstrap?: BootstrapData
};

export const ProductGalleryWidget = ({ config, bootstrap }: Props) => {
    const [mode, setMode] = useState<"tiled" | "classic">("tiled");
    const { galleryData, galleryError, galleryLoading } =
        useGalleryData(config.runtime.sku, bootstrap);

    if (galleryLoading) return <SpinnerOverlay />;
    if (galleryError) return null; // if the connection to Magento fails, we fail silently
    if (!galleryData) return null;

    return (
        <div>
            {/* Switch Button */}
            <button
                className="switchButton"
                onClick={() =>
                    setMode((prev) => (prev === "tiled" ? "classic" : "tiled"))
                }
                data-gallery-switch
            >
                Switch to {mode === "tiled" ? "Classic" : "Tiled"} View
            </button>

            {mode === "tiled" ? <ProductTiledGallery tiles={galleryData} /> : <ProductGallery tiles={galleryData} />}
        </div>
    );
};

