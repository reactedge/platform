import type { ListingMode } from '../controller/useListingController.ts';

const capabilities: { action: ListingMode; label: string }[] = [
    { action: 'create', label: 'Create listing' },
    { action: 'edit', label: 'Edit listing' },
    { action: 'delete', label: 'Delete listing' },
];

type Props = {
    mode: ListingMode | null;
    disabled: boolean;
    onChoose: (action: ListingMode) => void;
};

export const ListingCapabilities = ({ mode, disabled, onChoose }: Props) => (
    <aside className="word-editor__block-palette" aria-label="Listing capabilities">
        <h2 className="word-editor__block-palette-title">Capabilities</h2>
        <ul className="listing-workspace__capabilities">
            {capabilities.map(({ action, label }) => (
                <li key={action}>
                    <button type="button" className="word-editor__block" aria-pressed={mode === action}
                        disabled={disabled} onClick={() => onChoose(action)}>{label}</button>
                </li>
            ))}
        </ul>
    </aside>
);
