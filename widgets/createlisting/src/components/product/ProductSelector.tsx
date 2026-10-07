import { useId } from 'react';
import type { ProductRecord, ProductStatus } from '../../Model/Product.ts';

type Props = {
    products: ProductRecord[];
    selectedId: string;
    disabled?: boolean;
    onSelect: (id: string) => void;
};

const statusLabel: Record<ProductStatus, string> = {
    active: 'Active',
    disable: 'Disabled',
    inreview: 'In review',
};

export const ProductSelector = ({ products, selectedId, disabled = false, onSelect }: Props) => {
    const id = useId();
    const selected = products.find(product => product.id === selectedId);

    return (
        <>
            <label htmlFor={id}>Product</label>
            <select id={id} value={selectedId} disabled={disabled || products.length === 0}
                onChange={event => onSelect(event.target.value)}>
                <option value="">Choose a product</option>
                {products.map(product => (
                    <option key={product.id} value={product.id}>{product.title} ({product.sku})</option>
                ))}
            </select>

            {selected && (
                <span className={`listing-workspace__status-flag listing-workspace__status-flag--${selected.status}`}>
                    {statusLabel[selected.status]}
                </span>
            )}

            {products.length === 0 && <p>No products saved for this listing yet.</p>}
        </>
    );
};
