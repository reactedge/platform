import React from "react";
import type {MagentoLayeredNavigation} from "../../../../../../hooks/domain/useLayeredNavigation.tsx";
import {useTranslationState} from "../../../../../../state/Translation/useTranslationState.ts";
import {useIntentState} from "../../../../../../state/Intent/useIntentState.ts";

type Props = {
    attributeLayerData: MagentoLayeredNavigation
    intentStarted: boolean;
    remainingChars: number;
    resetClick: () => void;
}

export const Warning = ({
    attributeLayerData,
    intentStarted,
    remainingChars,
    resetClick
}: Props) => {
    const {t} = useTranslationState()
    const { intentState, getAiReadiness } = useIntentState()
    const gap = getAiReadiness(attributeLayerData)

    const getAiReadinessMessage = () => {
        if (intentStarted) {
            return "Add %s+ characters or refine your preferences"
        }

        return `${attributeLayerData.totalCount} matches, Target < 30`
    }

    if (intentState.status === "suggestionSent" || intentState.status === "suggestionProcessing" || intentState.status === "readyToRecommend") return null;

    return (
        <div className={`intent-ai-threshold ${gap === 100 ? "ready" : ""}`} data-state="warning">
            <div className="intent-ai-left">
                <div className="confidence">
                    {t("Ready to suggest")}
                </div>
                <div><button className="intent-reset" onClick={resetClick}>{t('Reset Filters')}</button></div>
            </div>
            <div className="help" data-readiness-hint>
                {t(getAiReadinessMessage(), remainingChars, gap)}
            </div>
        </div>
    )
}