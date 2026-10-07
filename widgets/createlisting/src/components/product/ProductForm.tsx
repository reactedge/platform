import { useId, type FormEvent } from "react";

type Props = {
    disabled?: boolean;
    onCancel: () => void;
};

export const ProductForm = ({
    disabled = false,
    onCancel,
}: Props) => {
    const skuId = useId();
    const titleId = useId();
    const descriptionId = useId();
    const priceId = useId();
    const imageId = useId();

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <form
            className="listing-workspace__product-form"
            onSubmit={submit}
        >
            <h3>Product details</h3>

            <label htmlFor={skuId}>SKU</label>
            <input
                id={skuId}
                name="sku"
                type="text"
                autoComplete="off"
                disabled={disabled}
                required
            />

            <label htmlFor={titleId}>Title</label>
            <input
                id={titleId}
                name="title"
                type="text"
                disabled={disabled}
                required
            />

            <label htmlFor={descriptionId}>Description</label>
            <textarea
                id={descriptionId}
                name="description"
                rows={5}
                disabled={disabled}
                required
            />

            <label htmlFor={priceId}>Price</label>
            <input
                id={priceId}
                name="price"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                disabled={disabled}
                required
            />

            <label htmlFor={imageId}>Image</label>
            <input
                id={imageId}
                name="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                disabled={disabled}
                required
            />

            <div className="word-editor__save-or-export">
                <button type="submit" disabled>
                    Save product
                </button>
                <button type="button" disabled={disabled} onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
};
