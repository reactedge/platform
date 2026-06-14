import React from 'react';
import type { WidgetConfig } from "./domain/megamenu.types.ts";
import { MegamenuContent } from "./components/MegamenuContent.tsx";
import {readWidgetConfig} from "./Config.ts";

type Props = {
    rawConfig: WidgetConfig;
};

export const MegamenuWidgetView = ({ rawConfig }: Props) => {
    const config = readWidgetConfig(rawConfig);

    if (!config) return null;

    return <MegamenuContent items={config?.data.items} theme={config.settings?.theme} />
};

