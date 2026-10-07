import { useState } from 'react';
import { ProductImage, type ProductImageUpload } from '../Model/ProductImage.ts';

const productImageModel = new ProductImage();

export function useProductImageController() {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const upload = async (files: File[]): Promise<ProductImageUpload[]> => {
        setBusy(true);
        setError('');
        try {
            return await productImageModel.upload(files);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unable to upload images.');
            throw error;
        } finally {
            setBusy(false);
        }
    };

    const clear = () => setError('');

    return {busy, error, upload, clear};
}
