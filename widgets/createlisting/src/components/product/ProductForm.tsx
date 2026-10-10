import {useEffect, useId, useState, type FormEvent} from 'react';
import type {
    ProductImageRecord,
    ProductInput,
    ProductRecord,
    ProductStatus,
} from '../../Model/Product.ts';
import {ProductImageField} from './ProductImageField.tsx';

type Props = {
    listingId: string;
    initial?: ProductRecord;
    disabled?: boolean;
    onCancel: () => void;
    onSave: (input: ProductInput) => Promise<unknown>;
};

type ProductDraft = {
    sku: string;
    title: string;
    description: string;
    price: string;
    status: ProductStatus;
    images: ProductImageRecord[];
};

function draftFrom(initial?: ProductRecord): ProductDraft {
    return {
        sku: initial ? initial.sku : '',
        title: initial ? initial.title : '',
        description: initial ? initial.description : '',
        price: initial ? String(initial.price) : '',
        status: initial ? initial.status : 'active',
        images: initial ? initial.images : [],
    };
}

export const ProductForm = (props: Props) => {
    const {listingId, initial, onCancel, onSave} = props;
    const disabled = props.disabled === true;
    const initialDraft = draftFrom(initial);
    const [sku, setSku] = useState(initialDraft.sku);
    const [title, setTitle] = useState(initialDraft.title);
    const [description, setDescription] = useState(initialDraft.description);
    const [price, setPrice] = useState(initialDraft.price);
    const [status, setStatus] = useState<ProductStatus>(initialDraft.status);
    const [images, setImages] = useState<ProductImageRecord[]>(initialDraft.images);

    const skuId = useId();
    const titleId = useId();
    const descriptionId = useId();
    const priceId = useId();
    const statusId = useId();

    useEffect(() => {
        const draft = draftFrom(initial);
        setSku(draft.sku);
        setTitle(draft.title);
        setDescription(draft.description);
        setPrice(draft.price);
        setStatus(draft.status);
        setImages(draft.images);
    }, [initial]);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await onSave({listingId, sku, title, description, price: Number(price), status, images});
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

            <label htmlFor={statusId}>Status</label>
            <select id={statusId} value={status} disabled={disabled}
                onChange={event => setStatus(event.target.value as ProductStatus)}>
                <option value="active">Active</option>
                <option value="disable">Disabled</option>
                <option value="inreview">In review</option>
            </select>

            <ProductImageField value={images} disabled={disabled} onChange={setImages} />

            <div className="word-editor__save-or-export">
                <button type="submit" disabled={disabled || images.length === 0}>
                    {disabled ? 'Saving…' : 'Save product'}
                </button>
                <button type="button" disabled={disabled} onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};
