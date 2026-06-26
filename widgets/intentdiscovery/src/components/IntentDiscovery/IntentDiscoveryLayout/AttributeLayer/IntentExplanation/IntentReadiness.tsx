import React from "react";
import type {MagentoLayeredNavigation} from "../../../../../hooks/domain/useLayeredNavigation.tsx";
import {useIntentState} from "../../../../../state/Intent/useIntentState.ts";
import {NoResult} from "./IntentReadiness/NoResult.tsx";
import {Success} from "./IntentReadiness/Success.tsx";
import {Warning} from "./IntentReadiness/Warning.tsx";
import {Ready} from "./IntentReadiness/Ready.tsx";

type Props = {
    attributeLayerData: MagentoLayeredNavigation
    intentStarted: boolean;
    canInterpretOrSuggest: boolean;
    remainingChars: number;
}

export const IntentReadiness = ({
     attributeLayerData,
     intentStarted,
     canInterpretOrSuggest,
     remainingChars
}: Props) => {
    const { intentState, resetIntent } = useIntentState()

    const resetClick = () => {
        resetIntent()
    }

    if (intentState.status === "noSuggestionFound") return <NoResult />

    if (intentState.status === "suggestionSent") return <Success />

    if (canInterpretOrSuggest) return <Ready attributeLayerData={attributeLayerData} resetClick={resetClick} />

    return <Warning
                attributeLayerData={attributeLayerData}
                intentStarted={intentStarted}
                remainingChars={remainingChars}
                resetClick={resetClick}
    />
}