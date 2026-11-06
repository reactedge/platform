import { useEffect, useRef, useState } from "react";
import { readWidgetConfig } from "./config/Config.ts";
import { useActivityContext } from "../activity/Context/useActivityContext.ts";
import { BannerSlider } from "../components/BannerSlider.tsx";
import { BannerStatic } from "../components/BannerStatic.tsx";
import { getVisibleSlides } from "../lib/vslide.ts";
import { resolveMode } from "../lib/media-queries.ts";

type Props = {
    contract?: unknown
    bootstrap?: unknown
};

export const WidgetWrapper = ({ contract }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const activity = useActivityContext()
    const config = readWidgetConfig(contract, activity);
    const [width, setWidth] = useState(1025);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver(([entry]) => {
            if (entry) setWidth(entry.contentRect.width);
        });

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    if (!config) return null;

    const currentMode = resolveMode(width, config);

    if (currentMode === "slider") {
        const visibleSlides = getVisibleSlides(
            width,
            config.settings.visibleSlides ?? 1
        )
        return <div ref={ref}>
            <BannerSlider slides={config.slides} visibleSlides={visibleSlides} />
        </div>;
    }

    return <div ref={ref}>
        <BannerStatic slides={config.slides} config={config.settings} />
    </div>;
};
