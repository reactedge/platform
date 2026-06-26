import {useState} from "react";
import {useTranslationState} from "../../../../state/Translation/useTranslationState.ts";
import type {EnrichedSuggestion} from "../../../../types/infra/magento/product.types.ts";
import {SuggestionCard} from "./SuggestionCard.tsx";

type Props = {
    recommendations?: EnrichedSuggestion[] | null
    onClose?: () => void
    title?: string
}

export const SuggestionContainer: React.FC<Props> = ({
     recommendations,
     onClose,
     title = "Suggestions",
    }) => {
    const [showAll, setShowAll] = useState(false);
    const { t } = useTranslationState()

    if (!recommendations?.length) return null

    const visibleCards = showAll ? recommendations : recommendations.slice(0, 1);

    return (
        <section className="re-intent-card">
            <header className="re-intent-header">
                <div className="re-intent-header-left">
                    <div className="re-intent-title">{title}</div>
                </div>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="re-intent-close-btn"
                    >
                        ×
                    </button>
                )}
            </header>

            <div className="re-intent-grid">
                {visibleCards.map((s) => (
                    <SuggestionCard key={s.sku} suggestion={s}/>
                ))}
                {recommendations.length > 1 && (
                    <button
                        className="choice-tile choice-tile--view-all"
                        onClick={() => setShowAll(prev => !prev)}
                    >
                        {showAll ? t("Show less") : t("View all")}
                    </button>
                )}
            </div>
        </section>
    )
}


