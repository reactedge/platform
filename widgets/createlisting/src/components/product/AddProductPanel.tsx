import { useId, useState } from "react";
import type { ListingRecord } from "../../Model/Listing.ts";
import { useProductController } from "../../controller/useProductController.ts";
import { ProductForm } from "./ProductForm.tsx";

type Props = {
    listings: ListingRecord[];
    disabled?: boolean;
    onCancel: () => void;
};

export const AddProductPanel = ({
    listings,
    disabled = false,
    onCancel,
}: Props) => {
    const [listingId, setListingId] = useState("");
    const controller = useProductController();
    const selectId = useId();
    const selectedListing = listings.find(listing => listing.id === listingId);
    const busy = disabled || controller.busy;

    const cancel = () => {
        controller.clear();
        onCancel();
    };

    return (
        <section className="listing-workspace__product" aria-label="Add product">
            <h2>Add product</h2>
            <p>Choose the listing this product will belong to.</p>

            <label htmlFor={selectId}>Listing</label>
            <select id={selectId} value={listingId} disabled={busy || listings.length === 0}
                onChange={event => { setListingId(event.target.value); controller.clear(); }}>
                <option value="">Choose a listing</option>
                {listings.map(listing => <option key={listing.id} value={listing.id}>{listing.name}</option>)}
            </select>

            {listings.length === 0 && <p>No saved listings yet. Create a listing first.</p>}

            {selectedListing && (
                <div className="listing-workspace__product-details">
                    <p><strong>Selected listing</strong></p>
                    <p>{selectedListing.name}</p>
                    <ProductForm listingId={selectedListing.id} disabled={busy} onCancel={cancel} onSave={controller.save} />
                </div>
            )}

            {controller.message && <p role="status">{controller.message}</p>}
            {controller.error && <p role="alert">{controller.error}</p>}
        </section>
    );
};
