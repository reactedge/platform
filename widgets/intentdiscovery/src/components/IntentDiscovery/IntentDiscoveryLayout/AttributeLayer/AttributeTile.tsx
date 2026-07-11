import {Icon} from "./Icon.tsx";
import {decodeHtmlEntities} from "../../../../lib/string.ts";
import type {MergedAttribute} from "../../../../hooks/infra/useMagentoLayeredData.tsx";

type AttributeTileProps = {
    attr: MergedAttribute;
    isSelected: boolean;
    value?: string[];
    onClick: () => void;
};

export const AttributeTile = ({ attr, isSelected, value, onClick }: AttributeTileProps) => {
    const visible = value && value.slice(0, 1) || []
    const remaining = value && visible && value?.length - visible.length || 0

    return (
        <div
            className="choice-tile"
            data-intent-card={attr.code}
            data-intent-active={isSelected}
            data-intent-activated={value && value?.length > 0}
            onClick={onClick}
        >
            <span className={`choice-tile__label ${isSelected ? 'choice-tile__label--selected' : ''}`}>
                {attr.label}
            </span>

            {value && <span className="choice-tile__info">
            {visible.map(v => (
                <span key={v} className="badge">{decodeHtmlEntities(v)}</span>
            ))}
                {remaining > 0 && (
                    <span className="badge badge--more">+{remaining}</span>
                )}
            </span>}

            <Icon attribute_code={attr.code}/>
        </div>
    )
}