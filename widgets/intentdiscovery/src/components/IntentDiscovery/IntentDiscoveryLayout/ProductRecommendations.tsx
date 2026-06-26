import {useIntentState} from "../../../state/Intent/useIntentState.ts";
import {useTranslationState} from "../../../state/Translation/useTranslationState.ts";
import {SuggestionContainer} from "./ProductRecommendations/SuggestionContainer.tsx";

export const ProductRecommendations = () => {
    const { intentState } = useIntentState()

    const { t } = useTranslationState()

    if (intentState.status !== "suggestionSent") return null;

    return (
        <SuggestionContainer
            recommendations={intentState.recommendations}
            title={t("AI suggestions")}
        />
    )
}