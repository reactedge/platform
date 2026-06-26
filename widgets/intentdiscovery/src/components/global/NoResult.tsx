import {useTranslationState} from "../../state/Translation/useTranslationState.ts";

export const NoResult = () => {
    const {t} = useTranslationState()

    return (
        <div className="intent-feedback">
            {t("The search has returned no results")}
        </div>
    )
}