import {useTranslationState} from "../../../../../../state/Translation/useTranslationState.ts";
import {useIntentState} from "../../../../../../state/Intent/useIntentState.ts";

export const Success = () => {
    const {t} = useTranslationState()
    const { intentState } = useIntentState()

    return (
        <div className="intent-banner success" data-state="success">
            {t("%s matching products found", intentState.recommendations.length)}
        </div>
    )
}