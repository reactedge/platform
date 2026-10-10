import {useId, useState} from 'react';
import type {ListingRecord} from '../../Model/Listing.ts';
import type {ProductController} from '../../controller/useProductController.ts';
import {ProductDeleteConfirmation} from './ProductDeleteConfirmation.tsx';
import {ProductForm} from './ProductForm.tsx';
import {ProductSelector} from './ProductSelector.tsx';

 type Props = {
    listings: ListingRecord[];
    controller: ProductController;
};

function modeHeading(mode: ProductController['mode']): string {
    if (mode === 'create') return 'Add product';
    if (mode === 'edit') return 'Edit product';
    return 'Delete product';
}

type EditorProps = {
    listing?: ListingRecord;
    selected?: ProductController['products'][number];
    controller: ProductController;
};

function ProductWorkspaceEditor({listing, selected, controller}: EditorProps) {
    if (!listing) return null;
    if (controller.mode === 'create') {
        return <ProductForm listingId={listing.id} disabled={controller.disabled}
            onCancel={controller.cancel} onSave={controller.save} />;
    }
    if (controller.mode === 'edit' && selected) {
        return <ProductForm listingId={listing.id} initial={selected} disabled={controller.disabled}
            onCancel={controller.cancel} onSave={controller.save} />;
    }
    if (controller.mode === 'delete' && selected) {
        return <ProductDeleteConfirmation product={selected} disabled={controller.disabled}
            onConfirm={controller.remove} onCancel={controller.cancel} />;
    }
    return null;
}

export const ProductWorkspace = ({listings, controller}: Props) => {
    const [listingId, setListingId] = useState('');
    const listingSelectId = useId();
    const selectedListing = listings.find(listing => listing.id === listingId);
    const products = controller.products.filter(product => product.listingId === listingId);
    const selected = products.find(product => product.id === controller.selectedId);

    return (
        <section className="listing-workspace__product" aria-label="Product management">
            <h2>{modeHeading(controller.mode)}</h2>
            <label htmlFor={listingSelectId}>Listing</label>
            <select id={listingSelectId} value={listingId} disabled={controller.disabled || listings.length === 0}
                onChange={event => { setListingId(event.target.value); controller.select(''); }}>
                <option value="">Choose a listing</option>
                {listings.map(listing => <option key={listing.id} value={listing.id}>{listing.name}</option>)}
            </select>
            {listings.length === 0 && <p>No saved listings yet. Create a listing first.</p>}
            {selectedListing && (controller.mode === 'edit' || controller.mode === 'delete') && (
                <div className="listing-workspace__product-details">
                    <ProductSelector products={products} selectedId={controller.selectedId}
                        disabled={controller.disabled} onSelect={controller.select} />
                    <ProductWorkspaceEditor listing={selectedListing} selected={selected} controller={controller} />
                </div>
            )}
            {selectedListing && controller.mode === 'create' && (
                <ProductWorkspaceEditor listing={selectedListing} selected={selected} controller={controller} />
            )}
            {controller.message && <p role="status">{controller.message}</p>}
            {controller.error && <p role="alert">{controller.error}</p>}
        </section>
    );
};
