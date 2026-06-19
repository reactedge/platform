import React from 'react';
import {type RawWidgetConfig, readWidgetConfig} from "./Config.ts";
import {useActivityContext} from "./activity/Context/useActivityContext.ts";
import {Widget} from "./components/Widget.tsx";

type Props = {
    rawConfig: RawWidgetConfig;
    onStable?: () => void;
};

export const WidgetWrapper = ({ rawConfig, onStable }: Props) => {
    const activity = useActivityContext()
    const config = readWidgetConfig(rawConfig, activity);

    return <Widget onStable={onStable} config={config} />
};

