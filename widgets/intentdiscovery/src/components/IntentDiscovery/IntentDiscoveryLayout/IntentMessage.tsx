import type {IntentControllerState} from "../../../domain/intent.types.ts";
import type {MagentoLayeredNavigation} from "../../../hooks/domain/useLayeredNavigation.tsx";
import {useTranslationState} from "../../../state/Translation/useTranslationState.ts";
import {useIntentState} from "../../../state/Intent/useIntentState.ts";
import {type ChangeEvent, useState} from "react";
import {intentPersistence} from "../../../services/intentPersistence/intentPersistence.service.ts";
import {PreviousIntent} from "./IntentMessage/PreviousIntent.tsx";
import {ChevronIcon} from "./IntentMessage/ChevronIcon.tsx";

type Props = {
    intent: IntentControllerState,
    attributeLayerData: MagentoLayeredNavigation
};
export const IntentMessage = ({intent, attributeLayerData}: Props) => {
    const {t} = useTranslationState()
    const { intentState } = useIntentState()
    const [isIntentOpen, setIsIntentOpen] = useState(false);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        intent.setIntent(e.target.value)
    }

    if (intentState.status === "suggestionProcessing" ||
        intentState.status === "readyToRecommend") return null;

    return (
        <div className="finder">
            <h2 className="finder__title">{t("May I ask why you came here to shop?")}</h2>
            <div className={`intent-drawer ${isIntentOpen ? "open" : ""}`}>
                {attributeLayerData.attributes && <PreviousIntent attributes={attributeLayerData.attributes}/>}
            </div>
            <div className="intent-input-wrapper">
                {!intentPersistence.isEmpty() &&
                    <button className="intent-apply-left"
                            onClick={() => setIsIntentOpen(prev => !prev)}
                    >
                        <ChevronIcon direction={isIntentOpen ? 'down' : 'right'} />
                    </button>
                }
                <input
                    type="text"
                    placeholder={t("Tell us what matters most for your purchase")}
                    value={intent.text}
                    onChange={(e) => handleTextChange(e)}
                    className="intent-input"
                />
            </div>
        </div>
    )
}