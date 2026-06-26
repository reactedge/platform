import type {IntentDisplayAttribute} from "../PreviousIntent.tsx";
import type {MergedAttribute} from "../../../../../hooks/infra/useMagentoLayeredData.tsx";
import type {AttributeFilters} from "../../../../../integration/intent/types.ts";
import type {OptionLabelMap} from "../../../../../domain/intent-discovery.types.ts";

type AttributeMap = Record<string, MergedAttribute>;

export function mapIntentToDisplay(
    scores: AttributeFilters | undefined,
    attributeMap: AttributeMap,
    optionLabelMap: OptionLabelMap
): IntentDisplayAttribute[] {
    if (!scores) return [];

    return Object.entries(scores)
        .flatMap(([attributeCode, optionMap]) => {
            return Object.keys(optionMap).map(optionValue => {
                const attr = attributeMap[attributeCode];
                const optionLabel = optionLabelMap
                    ?.get(attributeCode)
                    ?.get(optionValue);

                if (!attr || !optionLabel) return null;

                return {
                    label: attr.label,
                    attributeCode,
                    optionValue,
                    optionLabel
                };
            });
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);
}