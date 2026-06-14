import type {MagentoLayeredNavigation} from "../../../../../../hooks/domain/useLayeredNavigation.tsx";
import {useTranslationState} from "../../../../../../state/Translation/useTranslationState.ts";
import React from "react";

type Props = {
    attributeLayerData: MagentoLayeredNavigation
    resetClick: () => void;
}

export const Ready = ({
    attributeLayerData,
    resetClick
}: Props) => {
    const {t} = useTranslationState()

    return (
        <div className="intent-ai-threshold ready" data-state="warning">
            <div className="intent-ai-left">
                <div className="confidence">
                    {t("Ready to suggest")}
                </div>
                <button className="intent-reset" onClick={resetClick}>{t('Reset Filters')}</button>
            </div>
            <div className="help" data-readiness-hint>
                {t(`${attributeLayerData.totalCount} matches - AI ready to interpret your request`)}
            </div>
        </div>
    )
}