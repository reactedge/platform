import { useId } from 'react';
import { useProductImageController } from '../../controller/useProductImageController.ts';

type Props = {
    value: string;
    disabled?: boolean;
    onChange: (url: string) => void;
};

export const ProductImageField = ({ value, disabled = false, onChange }: Props) => {
    const inputId = useId();
    const controller = useProductImageController();

    const select = async (file?: File) => {
        if (!file) return;
        controller.clear();
        try {
            const uploaded = await controller.upload(file);
            onChange(uploaded.url);
        } catch {
            // Error state is owned by the image controller.
        }
    };

    return (
        <div className="listing-workspace__product-image">
            <label htmlFor={inputId}>Image</label>
            <input
                id={inputId}
                name="imageFile"
                type="file"
                accept="image/*"
                disabled={disabled || controller.busy}
                required={!value}
                onChange={event => { void select(event.target.files?.[0]); }}
            />

            {controller.busy && <p role="status">Uploading image…</p>}
            {controller.error && <p role="alert">{controller.error}</p>}

            {value && (
                <div className="listing-workspace__product-image-preview">
                    <img src={value} alt="Product preview" />
                    <p>Image uploaded.</p>
                </div>
            )}
        </div>
    );
};
