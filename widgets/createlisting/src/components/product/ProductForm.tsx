import { useEffect, useId, useState, type FormEvent } from "react";
import type { ProductInput, ProductRecord } from "../../Model/Product.ts";
import { ProductImageField } from "./ProductImageField.tsx";

type Props = {
    listingId: string;
    initial?: ProductRecord;
    disabled?: boolean;
    onCancel: () => void;
    onSave: (input: ProductInput) => Promise<unknown>;
};

export const ProductForm = ({
    listingId,
    initial,
    disabled = false,
    onCancel,
    onSave,
}: Props) => {
    const [sku, setSku] = useState(initial?.sku ?? '');
    const [title, setTitle] = useState(initial?.title ?? '');
    const [description, setDescription] = useState(initial?.description ?? '');
    const [price, setPrice] = useState(initial ? String(initial.price) : '');
    const [images, setImages] = useState<string[]>(initial?.images ?? []);

    const skuId = useId();
    const titleId = useId();
    const descriptionId = useId();
    const priceId = useId();

    useEffect(() => {
        setSku(initial?.sku ?? '');
        setTitle(initial?.title ?? '');
        setDescription(initial?.description ?? '');
        setPrice(initial ? String(initial.price) : '');
        setImages(initial?.images ?? []);
    }, [initial]);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await onSave({
            listingId,
            sku,
            title,
            description,
            price: Number(price),
            images,
        });
    };

    return (
        <form className="listing-workspace__product-form" onSubmit={event => { void submit(event); }}>
            <h3>{initial ? 'Edit product' : 'Product details'}</h3>

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

            {initial ? (
                <div className="listing-workspace__product-image">
                    <p><strong>Images</strong></p>
                    <div className="listing-workspace__product-image-previews" aria-label="Existing product images">
                        {images.map((url, index) => (
                            <figure key={url} className="listing-workspace__product-image-preview">
                                <img src={url} alt={`Product preview ${index + 1}`} />
                                <figcaption>Image {index + 1}</figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            ) : (
                <ProductImageField value={images} disabled={disabled} onChange={setImages} />
            )}

            <div className="word-editor__save-or-export">
                <button type="submit" disabled={disabled || images.length === 0}>
                    {disabled ? 'Saving…' : 'Save product'}
                </button>
                <button type="button" disabled={disabled} onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};
