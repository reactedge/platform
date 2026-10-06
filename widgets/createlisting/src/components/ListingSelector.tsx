import { useId } from 'react';
import type { ListingRecord } from '../Model/Listing.ts';

type Props = {
    listings: ListingRecord[];
    selectedId: string;
    action: 'edit' | 'delete';
    disabled: boolean;
    onSelect: (id: string) => void;
};

export const ListingSelector = ({ listings, selectedId, action, disabled, onSelect }: Props) => {
    const id = useId();
    const hintId = `${id}-hint`;

    return (
        <div className="listing-workspace__selector">
            <label htmlFor={id}>Select listing to {action}</label>
            <select id={id} value={selectedId} disabled={disabled || listings.length === 0}
                aria-describedby={hintId} onChange={event => onSelect(event.target.value)}>
                <option value="">Choose a listing</option>
                {listings.map(listing => <option key={listing.id} value={listing.id}>{listing.name}</option>)}
            </select>
            <p id={hintId}>{listings.length === 0 ? 'No saved listings yet.' : action === 'edit'
                ? 'Choose a listing to change its name.' : 'Choose a listing, then confirm its deletion.'}</p>
        </div>
    );
};
