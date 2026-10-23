import type { WidgetConfig } from "../Config";

type Props = {
    config: WidgetConfig;
};

export const WidgetSubscription = ({ config }: Props) => {
    return (
        <section aria-labelledby="subscription-title">
            <h1
                id="subscription-title"
                data-subscription-title
                style={{ color: config.settings.colour }}
            >
                {config.data.title}
            </h1>
            <p>Choose a subscription option that works for you.</p>
        </section>
    );
};
