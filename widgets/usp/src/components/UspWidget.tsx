import {useEffect, useRef, useState} from "react";
import {UspStatic} from "./UspStatic.tsx";
import {UspSlider} from "./UspSlider.tsx";
import {Spinner} from "./Spinner.tsx";
import type {WidgetConfig} from "../Config.ts";
import {resolveMode} from "../lib/media-queries.ts";

type Props = {
    config: WidgetConfig
};

export const UspWidget = ({ config }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState(config.settings.mode.desktop);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];

            if (!entry) {
                return;
            }

            const width = entry.contentRect.width;

            setMode(prev => {
                const next = resolveMode(width, config);
                return prev === next ? prev : next;
            });
        });

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [config]);

    if (config.data.slides.length === 0) {
        return <Spinner />;
    }

    const content =
        mode === "slider"
            ? <UspSlider slides={config.data.slides} config={config.settings} />
            : <UspStatic slides={config.data.slides} config={config.settings} />;

    return (
        <div ref={ref}>
            {content}
        </div>
    );
};
