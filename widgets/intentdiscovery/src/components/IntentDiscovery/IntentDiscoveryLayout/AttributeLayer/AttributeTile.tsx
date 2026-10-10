import {Icon} from './Icon.tsx';
import {decodeHtmlEntities} from '../../../../lib/string.ts';
import type {MergedAttribute} from '../../../../types/infra/magento/attribute.types.ts';

type AttributeTileProps = {
    attr: MergedAttribute;
    isSelected: boolean;
    value?: string[];
    onClick: () => void;
};

function hasSelectedValues(value?: string[]): boolean {
    return value !== undefined && value.length > 0;
}

function SelectedValueBadges({values}: {values: string[]}) {
    const visible = values.slice(0, 1);
    const remaining = values.length - visible.length;
    return (
        <span className="choice-tile__info">
            {visible.map(item => <span key={item} className="badge">{decodeHtmlEntities(item)}</span>)}
            {remaining > 0 && <span className="badge badge--more">+{remaining}</span>}
        </span>
    );
}

export const AttributeTile = (props: AttributeTileProps) => {
    const {attr, isSelected, value, onClick} = props;
    const hasValues = value !== undefined;
    return (
        <div
            className="choice-tile"
            data-intent-card={attr.code}
            data-intent-active={isSelected}
            data-intent-activated={hasSelectedValues(value)}
            onClick={onClick}
        >
            <span className={`choice-tile__label ${isSelected ? 'choice-tile__label--selected' : ''}`}>
                {attr.label}
            </span>
            {hasValues && <SelectedValueBadges values={value} />}
            <Icon attribute_code={attr.code} />
        </div>
    );
};
