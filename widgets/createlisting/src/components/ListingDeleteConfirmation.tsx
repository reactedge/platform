import type { ListingRecord } from '../Model/Listing.ts';

type Props = {
    listing: ListingRecord;
    productCount: number;
    busy: boolean;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
};

export const ListingDeleteConfirmation = ({
    listing,
    productCount,
    busy,
    onConfirm,
    onCancel,
}: Props) => {
    const blocked = productCount > 0;

    return (
        <section className="listing-workspace__confirmation" aria-label="Confirm deletion">
            <p>
                {blocked
                    ? `Listing “${listing.name}” contains ${productCount} ${productCount === 1 ? 'product' : 'products'}. Delete its products before deleting this listing.`
                    : `Delete listing “${listing.name}”? This cannot be undone.`}
            </p>
            <button type="button" className="listing-workspace__danger"
                disabled={busy || blocked} onClick={() => { void onConfirm(); }}>
                {busy ? 'Deleting…' : 'Confirm delete'}
            </button>
            <button type="button" disabled={busy} onClick={onCancel}>Cancel</button>
        </section>
    );
};
