import type {ContactUsConfig} from "../domain/contact.types.ts";

type Props = {
    config: ContactUsConfig;
};

export function ContactHeader({
        config,
    }: Props) {

    if (!config.title && !config.intro) return null;

    return (
        <div className="intro">
            <h1 data-contact-title>{config.title}</h1>
            <p>{config.intro}</p>
        </div>
    );
}
