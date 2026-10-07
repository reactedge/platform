import { useEffect, useState } from 'react';
import { Product, type ProductInput, type ProductRecord } from '../Model/Product.ts';

export type ProductMode = 'create' | 'edit' | 'delete';

const productModel = new Product();

export function useProductController() {
    const [mode, setMode] = useState<ProductMode | null>(null);
    const [products, setProducts] = useState<ProductRecord[]>([]);
    const [selectedId, setSelectedId] = useState('');
    const [busy, setBusy] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const selected = products.find(product => product.id === selectedId);

    useEffect(() => {
        let active = true;
        void productModel.list()
            .then(records => { if (active) setProducts(records); })
            .catch(error => { if (active) setError(error instanceof Error ? error.message : 'Unable to load saved products.'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const begin = (nextMode: ProductMode) => {
        setMode(nextMode);
        setSelectedId('');
        clearFeedback();
    };

    const select = (id: string) => {
        setSelectedId(id);
        clearFeedback();
    };

    const cancel = () => {
        setMode(null);
        setSelectedId('');
        clearFeedback();
    };

    const save = async (input: ProductInput): Promise<ProductRecord> => {
        setBusy(true);
        clearFeedback();
        try {
            const product = mode === 'edit' && selected
                ? await productModel.update(selected.id, input)
                : await productModel.create(input);
            setProducts(current => mode === 'edit'
                ? current.map(record => record.id === product.id ? product : record)
                : [...current, product]);
            setMessage(`Product “${product.title}” saved.`);
            if (mode === 'edit') setSelectedId(product.id);
            return product;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unable to save product.');
            throw error;
        } finally {
            setBusy(false);
        }
    };

    const remove = async (): Promise<void> => {
        if (!selected) return;
        setBusy(true);
        clearFeedback();
        try {
            await productModel.delete(selected.id);
            setProducts(current => current.filter(product => product.id !== selected.id));
            setMessage(`Product “${selected.title}” deleted.`);
            setSelectedId('');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unable to delete product.');
        } finally {
            setBusy(false);
        }
    };

    const clearFeedback = () => {
        setError('');
        setMessage('');
    };

    return {
        mode,
        products,
        selected,
        selectedId,
        busy,
        loading,
        error,
        message,
        disabled: busy || loading,
        begin,
        select,
        cancel,
        save,
        remove,
        clearFeedback,
    };
}

export type ProductController = ReturnType<typeof useProductController>;
