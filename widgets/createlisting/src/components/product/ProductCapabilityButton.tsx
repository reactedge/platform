type Props = {
    active: boolean;
    disabled?: boolean;
    onSelect: () => void;
};

export const ProductCapabilityButton = ({
    active,
    disabled = false,
    onSelect,
}: Props) => (
    <li className="listing-workspace__product-capability">
        <button
            type="button"
            className="word-editor__block"
            aria-pressed={active}
            disabled={disabled}
            onClick={onSelect}
        >
            Add product
        </button>
    </li>
);
