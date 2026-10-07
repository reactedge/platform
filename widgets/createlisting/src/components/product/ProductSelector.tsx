import { useId } from 'react';
import type { ProductRecord } from '../../Model/Product.ts';

type Props = {
    products: ProductRecord[];
    selectedId: string;
    disabled?: boolean;
    onSelect: (id: string) => void;
};

export const ProductSelector = ({ products, selectedId, disabled = false, onSelect }: Props) => {
    const id = useId();

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
            {products.length === 0 && <p>No products saved for this listing yet.</p>}
        </>
    );
};
