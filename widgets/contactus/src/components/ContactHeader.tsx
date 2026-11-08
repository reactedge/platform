import type {WidgetConfig} from "../domain/contact.types.ts";

type Props = {
    config: WidgetConfig;
};

export function ContactHeader({
        config,
    }: Props) {

    if (!config.title && !config.intro) return null;

    return (
        <header className="intro">
            <h2 data-contact-title>{config.title}</h2>
            <p>{config.intro}</p>
        </header>
    );
}
