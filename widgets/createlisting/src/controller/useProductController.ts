import { useState } from 'react';
import { Product, type ProductInput, type ProductRecord } from '../Model/Product.ts';

const productModel = new Product();

export function useProductController() {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [lastSaved, setLastSaved] = useState<ProductRecord | null>(null);

    const save = async (input: ProductInput): Promise<ProductRecord> => {
        setBusy(true);
        setError('');
        setMessage('');
        try {
            const product = await productModel.create(input);
            setLastSaved(product);
            setMessage(`Product “${product.title}” saved.`);
            return product;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unable to save product.');
            throw error;
        } finally {
            setBusy(false);
        }
    };

    const clear = () => {
        setError('');
        setMessage('');
    };

    return { busy, error, message, lastSaved, save, clear };
}

export type ProductController = ReturnType<typeof useProductController>;
