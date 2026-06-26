import {useEffect, useRef, useState} from "react";
import type {Props} from "../AttributeLayer.tsx";
import {useIntentState} from "../../../../state/Intent/useIntentState.ts";
import {useAskAi} from "../../../../hooks/domain/useAiInterpretation.tsx";
import {useAnalyseSearch} from "../../../../hooks/domain/useAnalyseSearch.tsx";
import {isSnapshotCompatible} from "../../../../domain/intent/snapshotMatcher.ts";
import {getInterpretationEvent} from "../../../../domain/intent/readinessTransition.ts";
import {intentSnapshotService} from "../../../../services/intentPersistence/intentSnapshot.service.ts";

export function useAttributeLayerController({
     intent,
     attributeLayerData,
     categoryData,
     config
 }: Props) {
    const [loading, setLoading] = useState(false);
    const { dispatch, intentState } = useIntentState();

    const askAi = useAskAi({
        intent,
        attributeLayerData,
        config,
        setLoading
    });

    const askAiRecommendations = useAnalyseSearch({
        attributeLayerData,
        categoryData,
        intentState
    });

    // --- trigger recommendations
    useEffect(() => {
        if (intentState.status === "readyToRecommend") {
            askAiRecommendations();
        }
    }, [intentState.status]);

    // --- restore session suggestions
    const hasRestored = useRef(false);

    useEffect(() => {
        function handleRequest() {
            const snapshot = intentSnapshotService.load();
            if (!snapshot || !snapshot.recommendations?.length) return;

            window.dispatchEvent(
                new CustomEvent('reactedge:recommendations', {
                    detail: {
                        recommendations: snapshot.recommendations
                    }
                })
            );
        }

        window.addEventListener('reactedge:request-recommendations', handleRequest);

        return () => {
            window.removeEventListener('reactedge:request-recommendations', handleRequest);
        };
    }, [intentState.recommendations]);

    useEffect(() => {
        if (hasRestored.current) return;

        try {
            const snapshot = intentSnapshotService.load();
            if (!snapshot) return;

            if (isSnapshotCompatible(snapshot, intentState)) {
                dispatch({
                    type: "SUGGESTION_PROPAGATE",
                    recommendations: snapshot.recommendations,
                    filters: JSON.parse(snapshot.filtersHash),
                    intent: snapshot.intentText
                });

                hasRestored.current = true; // ✅ lock after success
            } else {
                //intentSnapshotService.clear();
            }
        } catch {
            // silent
        }
    }, [intentState.attributeScore]);

    // --- threshold crossing detection
    const prevRemaining = useRef<number | null>(null);

    useEffect(() => {
        const prev = prevRemaining.current;
        const current = intent.remainingChars;

        const event = getInterpretationEvent(prev, current, intent.text);
        if (event) dispatch(event);

        prevRemaining.current = current;
    }, [intent.remainingChars]);

    const handleAsk = () => {
        dispatch({
            type: "INTERPRETATION_READY",
            payload: { intent: intent.text }
        });
        askAi();
    };

    // --- visibility rules
    const shouldHide =
        loading ||
        intentState.status === "suggestionProcessing" ||
        intentState.status === "readyToRecommend";

    return {
        handleAsk,
        shouldHide,
        intentState
    };
}