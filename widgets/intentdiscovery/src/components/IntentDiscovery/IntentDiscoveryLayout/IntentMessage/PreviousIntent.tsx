import {PreviousFilters} from "./PreviousIntent/PreviousFilters.tsx";
import {resolvePersistedIntentFilters} from "./PreviousIntent/resolvePersistedIntentFilters.ts";
import type {MergedAttribute} from "../../../../hooks/infra/useMagentoLayeredData.tsx";
import {useIntentState} from "../../../../state/Intent/useIntentState.ts";
import {useOptionLabelMap} from "../../../../hooks/domain/useOptionLabelMap.ts";
import {
    intentPersistence,
    type PersistedIntentV1
} from "../../../../services/intentPersistence/intentPersistence.service.ts";
import {useTranslationState} from "../../../../state/Translation/useTranslationState.ts";

type Props = {
    attributes: MergedAttribute[]
}

export type IntentDisplayAttribute = {
    label: string;
    attributeCode: string;
    optionValue: string;
    optionLabel: string;
};

export const PreviousIntent = ({ attributes }: Props) => {
    const { dispatch } = useIntentState();
    const {t} = useTranslationState()

    const optionLabelMap = useOptionLabelMap(attributes);
    const intent = intentPersistence.load();

    if (!intent) return null;

    const attributesDisplay = resolvePersistedIntentFilters(
        attributes,
        intent,
        optionLabelMap
    );

    if (attributesDisplay.length === 0) return null;

    function handleReuse() {
        dispatch({
            type: "BOOTSTRAP_FROM_PERSISTED_INTENT",
            payload: intent as PersistedIntentV1
        });
    }

    return (
        <div className="intent-resume">
            <div className="intent-resume__title">
                <span>{t("Reuse your previous filters in this category")}</span>
                <button
                    className="intent-resume__button"
                    onClick={handleReuse}
                >
                    {t("Apply")}
                </button>
            </div>

            <PreviousFilters attributesDisplay={attributesDisplay} />
        </div>
    );
};