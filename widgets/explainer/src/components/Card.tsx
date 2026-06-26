import type {CardData} from "../ExplainerConfig.ts";

interface CardProps {
    data: CardData,
    close: () => void
}

export function Card({data}: CardProps) {
    const layoutClass =
        data.layout === "right" ? "re-layout-right" : "re-layout-left";

    return (
        <div className={`re-explainer-card ${layoutClass}`}>
            {data.illustration && (
                <div className="re-explainer-illustration" aria-hidden="true">
                    <img
                        src={data.illustration?.svg}
                        alt=""
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            )}

            <div className="re-explainer-content">
                <h2>{data.title}</h2>

                <p className="re-explainer-summary">
                    {data.summary}
                </p>

                {data.sections.map((section, index) => (
                    <div
                        key={index}
                        className={`re-explainer-section re-explainer-section--${section.type}`}
                    >
                        <h3 className="re-explainer-section-title">
                            {section.title}
                        </h3>

                        <ul className="re-explainer-section-list">
                            {section.items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}

                <p className="re-explainer-closing">
                    {data.closing}
                </p>
            </div>
        </div>
    );
}
