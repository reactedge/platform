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

            {isSmallScreen && config.data.categories.length > 1 && (
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
                {config.data.categories.map((category, index) => (
                    <li className="categoryfeatured__item" key={`${category.url}-${index}`}>
                        <a className="categoryfeatured__card" href={category.url}>
                            <img
                                className="categoryfeatured__image"
                                src={category.image}
                                alt={category.imageAlt}
                                loading="lazy"
                            />
                            <span className="categoryfeatured__label">{category.title}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
};
