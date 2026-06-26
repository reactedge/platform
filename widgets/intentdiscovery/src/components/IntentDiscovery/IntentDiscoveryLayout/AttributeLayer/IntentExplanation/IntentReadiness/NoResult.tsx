import {useTranslationState} from "../../../../../../state/Translation/useTranslationState.ts";

export const NoResult = () => {
    const {t} = useTranslationState()

    return (
        <div className="intent-banner empty">
            {t("No match products found")}
        </div>
    )
}