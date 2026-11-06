import type { WidgetConfig } from "../bootstrap/config/Config.ts";

type Props = {
    config: WidgetConfig;
};

export const Widget__WIDGET_PASCAL_NAME__ = ({
     config,
 }: Props) => {
    return (
        <h1
            data-__WIDGET_NAME__-title
            style={{ color: config.settings.colour }}
        >
            {config.data.title}
        </h1>
    );
};
