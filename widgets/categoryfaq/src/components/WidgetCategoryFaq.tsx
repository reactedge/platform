import type { WidgetConfig } from "../bootstrap/config/Config.ts";

type Props = {
    config: WidgetConfig;
};

export const WidgetCategoryFaq = ({ config }: Props) => {
    if (config.data.faqs.length === 0) return null;

    return (
        <section className="categoryfaq" aria-labelledby="categoryfaq-title">
            <h2 id="categoryfaq-title" data-categoryfaq-title style={{ color: config.settings.colour }}>
                {config.data.title}
            </h2>
            <ul className="categoryfaq__list">
                {config.data.faqs.map((faq, index) => (
                    <li className="categoryfaq__item" key={`${faq.question}-${index}`}>
                        <details>
                            <summary>{faq.question}</summary>
                            <p className="categoryfaq__answer">{faq.answer}</p>
                        </details>
                    </li>
                ))}
            </ul>
        </section>
    );
};
