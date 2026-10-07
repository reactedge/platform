import { useId } from 'react';
import { useProductImageController } from '../../controller/useProductImageController.ts';

type Props = {
    value: string[];
    disabled?: boolean;
    onChange: (urls: string[]) => void;
};

export const ProductImageField = ({ value, disabled = false, onChange }: Props) => {
    const inputId = useId();
    const controller = useProductImageController();

    const select = async (files: FileList | null) => {
        const selected = files ? Array.from(files) : [];
        if (selected.length === 0) return;

        controller.clear();
        try {
            const uploaded = await controller.upload(selected, value.length);
            onChange([...value, ...uploaded.map(image => image.url)]);
        } catch {
            // Error state is owned by the image controller.
        }
    };

    return (
        <div className="listing-workspace__product-image">
            <label htmlFor={inputId}>Images</label>
            <input
                id={inputId}
                name="imageFiles"
                type="file"
                accept="image/*"
                multiple
                disabled={disabled || controller.busy || value.length >= 10}
                required={value.length === 0}
                onChange={event => { void select(event.target.files); }}
            />
            <p className="listing-workspace__product-image-hint">
                Select additional images from one folder, up to 10 images in total.
            </p>

            {controller.busy && <p role="status">Uploading images…</p>}
            {controller.error && <p role="alert">{controller.error}</p>}

            {value.length > 0 && (
                <div className="listing-workspace__product-image-previews" aria-label="Uploaded product images">
                    {value.map((url, index) => (
                        <figure key={url} className="listing-workspace__product-image-preview">
                            <img src={url} alt={`Product preview ${index + 1}`} />
                            <figcaption>Image {index + 1}</figcaption>
                        </figure>
                    ))}
                </div>
            )}
        </div>
    );
};
