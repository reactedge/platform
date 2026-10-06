import type {WidgetConfig} from "../Config.ts";

type Props = {
    config: WidgetConfig
};
export const Header = ({
    config
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
                    Create, edit and export documents
                </p>
            </div>
        </header>
    );
}