import type { WidgetConfig } from "../Config";

type Props = {
    config: WidgetConfig;
};

export const WidgetCmsblock = ({
     config,
 }: Props) => {
    return (
        <h1
            data-cmsblock-title
            style={{ color: config.settings.colour }}
        >
            {config.data.title}
        </h1>
    );
};