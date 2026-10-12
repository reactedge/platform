import { useId, useState } from 'react';
import type { ListingRecord } from '../../Model/Listing.ts';
import type { ProductController } from '../../controller/useProductController.ts';
import { ProductDeleteConfirmation } from './ProductDeleteConfirmation.tsx';
import { ProductForm } from './ProductForm.tsx';
import { ProductSelector } from './ProductSelector.tsx';

type Props = {
    listings: ListingRecord[];
    controller: ProductController;
};

export const ProductWorkspace = ({ listings, controller }: Props) => {
    const [listingId, setListingId] = useState('');
    const listingSelectId = useId();
    const selectedListing = listings.find(listing => listing.id === listingId);
    const products = controller.products.filter(product => product.listingId === listingId);
    const selected = products.find(product => product.id === controller.selectedId);
    const disabled = controller.disabled;

    return (
        <section className="listing-workspace__product" aria-label="Product management">
            <h2>{controller.mode === 'create' ? 'Add product' : controller.mode === 'edit' ? 'Edit product' : 'Delete product'}</h2>

            <label htmlFor={listingSelectId}>Listing</label>
            <select id={listingSelectId} value={listingId} disabled={disabled || listings.length === 0}
                onChange={event => { setListingId(event.target.value); controller.select(''); }}>
                <option value="">Choose a listing</option>
                {listings.map(listing => <option key={listing.id} value={listing.id}>{listing.name}</option>)}
            </select>

            {listings.length === 0 && <p>No saved listings yet. Create a listing first.</p>}

            {selectedListing && controller.mode === 'create' && (
                <ProductForm listingId={selectedListing.id} disabled={disabled}
                    onCancel={controller.cancel} onSave={controller.save} />
            )}

            {selectedListing && (controller.mode === 'edit' || controller.mode === 'delete') && (
                <div className="listing-workspace__product-details">
                    <ProductSelector products={products} selectedId={controller.selectedId}
                        disabled={disabled} onSelect={controller.select} />

                    {controller.mode === 'edit' && selected && (
                        <ProductForm listingId={selectedListing.id} initial={selected} disabled={disabled}
                            onCancel={controller.cancel} onSave={controller.save} />
                    )}

                    {controller.mode === 'delete' && selected && (
                        <ProductDeleteConfirmation product={selected} disabled={disabled}
                            onConfirm={controller.remove} onCancel={controller.cancel} />
                    )}
                </div>
            )}

            {controller.message && <p role="status">{controller.message}</p>}
            {controller.error && <p role="alert">{controller.error}</p>}
        </section>
    );
};
