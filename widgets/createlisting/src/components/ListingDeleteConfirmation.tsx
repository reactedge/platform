import type { ListingRecord } from '../Model/Listing.ts';

type Props = {
    listing: ListingRecord;
    busy: boolean;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
};

export const ListingDeleteConfirmation = ({ listing, busy, onConfirm, onCancel }: Props) => (
    <section className="listing-workspace__confirmation" aria-label="Confirm deletion">
        <p>Delete listing “{listing.name}”? This cannot be undone.</p>
        <button type="button" className="listing-workspace__danger" disabled={busy} onClick={() => { void onConfirm(); }}>
            {busy ? 'Deleting…' : 'Confirm delete'}
        </button>
        <button type="button" disabled={busy} onClick={onCancel}>Cancel</button>
    </section>
);
