import type {MagentoLayeredNavigation} from "../../../../../hooks/domain/useLayeredNavigation.tsx";
import {useFindAttributeOptionsByCode} from "../../../../../hooks/domain/useFindAttributeOptionsByCode.tsx";
import type {MergedAttributeOption} from "../../../../../hooks/infra/useMagentoLayeredData.tsx";
import {formatRange} from "../../../../../lib/price.ts";

interface StepFinderProps {
    attributeLayerData: MagentoLayeredNavigation
}

export const StepPriceFinder = ({attributeLayerData}: StepFinderProps) => {
    const option = 'price'
    const {attributeData} = useFindAttributeOptionsByCode(option, attributeLayerData)

    const onChange = () => {
        //
    };

    return (
        <div className="step-finder">
            {attributeData?.options.map((option: MergedAttributeOption) => (
                <label
                    key={option.value}
                    className="choice-tile"
                >
                    <input
                        type="radio"
                        name="preference"
                        value={option.value}
                        onChange={onChange}
                    />

                    <span className="choice-tile__label">
                            {formatRange(option.label)}
                        </span>
                </label>
            ))}
        </div>
    )
}
