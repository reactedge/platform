import type {WidgetConfig} from "../Config.ts";

type Props = {
    config: Pick<WidgetConfig, "data" | "settings">;
    subtitle?: string
};
export const Header = ({
    config,
    subtitle = "Create, edit and export documents"
}: Props) => {
    return (
        <header className="word-editor__header">
            <div>
                <h1 data-wordeditor-title
                    className="word-editor__title"
                    style={{ color: config.settings.colour }}
                >
                    {config.data.title}
                </h1>
                <p className="word-editor__subtitle">
                    {subtitle}
                </p>
            </div>
        </header>
    );
}