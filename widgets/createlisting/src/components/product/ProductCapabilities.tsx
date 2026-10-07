import type { ProductMode } from "../../controller/useProductController.ts";

const capabilities: { mode: ProductMode; label: string }[] = [
    { mode: 'create', label: 'Add product' },
    { mode: 'edit', label: 'Edit product' },
    { mode: 'delete', label: 'Delete product' },
];

type Props = {
    mode: ProductMode | null;
    disabled?: boolean;
    onChoose: (mode: ProductMode) => void;
};

export const ProductCapabilities = ({ mode, disabled = false, onChoose }: Props) => (
    <>
        {capabilities.map(capability => (
            <li key={capability.mode} className={capability.mode === 'create' ? 'listing-workspace__product-capability' : undefined}>
                <button type="button" className="word-editor__block" aria-pressed={mode === capability.mode}
                    disabled={disabled} onClick={() => onChoose(capability.mode)}>
                    {capability.label}
                </button>
            </li>
        ))}
    </>
);
