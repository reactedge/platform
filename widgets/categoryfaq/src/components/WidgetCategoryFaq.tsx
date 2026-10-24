import type { WidgetConfig } from "../Config";

type Props = {
    config: WidgetConfig;
};

export const WidgetCategoryFaq = ({ config }: Props) => {
    return (
        <section className="categoryfaq" aria-labelledby="categoryfaq-title">
            <h1 id="categoryfaq-title" data-categoryfaq-title style={{ color: config.settings.colour }}>
                {config.data.title}
            </h1>
            {config.data.faqs.length > 0 && (
                <div className="categoryfaq__list">
                    {config.data.faqs.map((faq, index) => (
                        <details className="categoryfaq__item" key={`${faq.question}-${index}`}>
                            <summary>{faq.question}</summary>
                            <div className="categoryfaq__answer">{faq.answer}</div>
                        </details>
                    ))}
                </div>
            )}
        </section>
    );
};
