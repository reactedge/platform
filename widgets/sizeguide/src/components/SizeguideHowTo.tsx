import type { WidgetConfig } from "../Config";

type Props = {
    config: WidgetConfig;
};

export const SizeguideHowTo = ({ config }: Props) => {
    if (config.data.instructions.length === 0 && !config.data.diagram) return null;

    return (
        <div className="sizeguide__how-to">
            {config.data.instructions.length > 0 && (
                <div className="sizeguide__instruction-list">
                    <h2>How to take your measurements</h2>
                    {config.data.instructions.map(instruction => (
                        <section className="sizeguide__instruction" key={instruction.title}>
                            <h3>{instruction.title}</h3>
                            <p>{instruction.text}</p>
                        </section>
                    ))}
                </div>
            )}
            {config.data.diagram && (
                <img
                    className="sizeguide__diagram"
                    src={config.data.diagram.src}
                    alt={config.data.diagram.alt}
                    loading="lazy"
                />
            )}
        </div>
    );
};