import { useId, useState, type FormEvent } from "react";
import type { ProductInput } from "../../Model/Product.ts";

type Props = {
    listingId: string;
    disabled?: boolean;
    onCancel: () => void;
    onSave: (input: ProductInput) => Promise<unknown>;
};

export const ProductForm = ({
    listingId,
    disabled = false,
    onCancel,
    onSave,
}: Props) => {
    const [sku, setSku] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');

    const skuId = useId();
    const titleId = useId();
    const descriptionId = useId();
    const priceId = useId();
    const imageId = useId();

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await onSave({
            listingId,
            sku,
            title,
            description,
            price: Number(price),
            image,
        });
    };

    return (
        <form className="listing-workspace__product-form" onSubmit={event => { void submit(event); }}>
            <h3>Product details</h3>

            <label htmlFor={skuId}>SKU</label>
            <input id={skuId} name="sku" type="text" autoComplete="off" value={sku}
                onChange={event => setSku(event.target.value)} disabled={disabled} required />

            <label htmlFor={titleId}>Title</label>
            <input id={titleId} name="title" type="text" value={title}
                onChange={event => setTitle(event.target.value)} disabled={disabled} required />

            <label htmlFor={descriptionId}>Description</label>
            <textarea id={descriptionId} name="description" rows={5} value={description}
                onChange={event => setDescription(event.target.value)} disabled={disabled} required />

            <label htmlFor={priceId}>Price</label>
            <input id={priceId} name="price" type="number" min="0" step="0.01" inputMode="decimal" value={price}
                onChange={event => setPrice(event.target.value)} disabled={disabled} required />

            <label htmlFor={imageId}>Image</label>
            <input id={imageId} name="image" type="url" placeholder="https://example.com/image.jpg" value={image}
                onChange={event => setImage(event.target.value)} disabled={disabled} required />

            <div className="word-editor__save-or-export">
                <button type="submit" disabled={disabled}>
                    {disabled ? 'Saving…' : 'Save product'}
                </button>
                <button type="button" disabled={disabled} onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};
