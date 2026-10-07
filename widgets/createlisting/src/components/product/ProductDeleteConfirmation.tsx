import type { ProductRecord } from '../../Model/Product.ts';

type Props = {
    product: ProductRecord;
    disabled?: boolean;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
};

export const ProductDeleteConfirmation = ({ product, disabled = false, onConfirm, onCancel }: Props) => (
    <section className="listing-workspace__product-delete" aria-label="Confirm product deletion">
        <p>Delete product “{product.title}”? This cannot be undone.</p>
        <div className="word-editor__save-or-export">
            <button type="button" disabled={disabled} onClick={() => { void onConfirm(); }}>
                {disabled ? 'Deleting…' : 'Confirm delete'}
            </button>
            <button type="button" disabled={disabled} onClick={onCancel}>Cancel</button>
        </div>
    </section>
);
