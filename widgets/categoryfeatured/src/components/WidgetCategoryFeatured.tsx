import { useEffect, useRef, useState } from "react";
import type { WidgetConfig } from "../Config";

type Props = {
    config: WidgetConfig;
};

export const WidgetCategoryFeatured = ({ config }: Props) => {
    const trackRef = useRef<HTMLUListElement>(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        const updateScreenSize = () => setIsSmallScreen(mediaQuery.matches);

        updateScreenSize();
        mediaQuery.addEventListener("change", updateScreenSize);

        return () => mediaQuery.removeEventListener("change", updateScreenSize);
    }, []);

    if (config.data.cards.length === 0) return null;

    const browse = (direction: -1 | 1) => {
        const track = trackRef.current;
        if (!track) return;

        const card = track.querySelector<HTMLElement>(".categoryfeatured__item");
        const distance = card ? card.offsetWidth + 16 : track.clientWidth;
        track.scrollBy({ left: direction * distance, behavior: "smooth" });
    };

    return (
        <section className="categoryfeatured" aria-labelledby="categoryfeatured-title">
            <h1
                id="categoryfeatured-title"
                className="categoryfeatured__title"
                data-categoryfeatured-title
                style={{ color: config.settings.colour }}
            >
                {config.data.title}
            </h1>

            {isSmallScreen && config.data.cards.length > 1 && (
                <div className="categoryfeatured__browse">
                    <button
                        className="categoryfeatured__arrow"
                        type="button"
                        aria-label="Show previous categories"
                        aria-controls="categoryfeatured-list"
                        data-categoryfeatured-prev
                        onClick={() => browse(-1)}
                    >
                        ‹
                    </button>
                    <button
                        className="categoryfeatured__arrow"
                        type="button"
                        aria-label="Show more categories"
                        aria-controls="categoryfeatured-list"
                        data-categoryfeatured-next
                        onClick={() => browse(1)}
                    >
                        ›
                    </button>
                </div>
            )}

            <ul className="categoryfeatured__track" id="categoryfeatured-list" ref={trackRef}>
                {config.data.cards.map((card, index) => (
                    <li className="categoryfeatured__item" key={`${card.link}-${index}`}>
                        <a
                            className="categoryfeatured__card"
                            href={card.link}
                            data-categoryfeatured-card-type={card.type}
                            {...(card.type === 'external'
                                ? { target: '_blank', rel: 'noreferrer' }
                                : {})}
                        >
                            <img
                                className="categoryfeatured__image"
                                src={card.thumbnail}
                                alt={card.altText}
                                loading="lazy"
                            />
                            <span className="categoryfeatured__label">{card.title}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
};
