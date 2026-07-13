import type {IntentDisplayAttribute} from "../PreviousIntent.tsx";
import {unescapeHtml} from "../../../../../lib/string.ts";

type Props = {
    attributesDisplay: IntentDisplayAttribute[]
}

export const PreviousFilters = ({ attributesDisplay }: Props) => {
    if (attributesDisplay.length === 0) return null;

    return (
        <div className="intent-resume__filters">
            {attributesDisplay.map((a) => (
                <span
                    key={`${a.attributeCode}-${a.optionValue}`}
                    className="intent-resume__chip"
                >
                    {unescapeHtml(a.optionLabel)}
                </span>
            ))}
        </div>
    );
};