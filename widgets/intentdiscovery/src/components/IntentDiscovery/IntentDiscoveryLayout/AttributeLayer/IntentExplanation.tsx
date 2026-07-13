import type {MagentoLayeredNavigation} from "../../../../hooks/domain/useLayeredNavigation.tsx";
import type {IntentControllerState} from "../../../../domain/intent.types.ts";
import {useTranslationState} from "../../../../state/Translation/useTranslationState.ts";
import {useIntentState} from "../../../../state/Intent/useIntentState.ts";
import {IntentReadiness} from "./IntentExplanation/IntentReadiness.tsx";

type IntentExplanationProps = {
    attributeLayerData: MagentoLayeredNavigation
    intent: IntentControllerState
    remainingChars: number;
    onAsk: () => void;
};

export const IntentExplanation = ({
    attributeLayerData,
    intent,
    remainingChars,
    onAsk
}: IntentExplanationProps) => {
    const { t } = useTranslationState();
    const { intentState, getAiReadiness } = useIntentState()
    const gap = getAiReadiness(attributeLayerData)
    const canInterpretOrSuggest =
        intentState.intentInterpretationReady || gap === 100;

    const intentStarted = !!intent?.text?.trim()

    return (
        <>
            <div className="intent-explanations">
                <button
                    onClick={onAsk}
                    className="filter-apply-button"
                    disabled={!canInterpretOrSuggest}
                >
                    {t("Suggest Products")}
                </button>
                <label className="intent-subtitle">
                    {t("Describe what you're looking for")}
                </label>
            </div>
            <IntentReadiness
                attributeLayerData={attributeLayerData}
                intentStarted={intentStarted}
                remainingChars={remainingChars}
                canInterpretOrSuggest={canInterpretOrSuggest}
            />
        </>
    );
};