import type { ListingRecord } from '../Model/Listing.ts';

type Props = { listings: ListingRecord[] };

export const SavedListings = ({ listings }: Props) => {
    if (listings.length === 0) return null;

    return (
        <section className="listing-workspace__saved" aria-label="Saved listings">
            <h2>Saved listings <span className="listing-workspace__count">{listings.length}</span></h2>
            <ul>{listings.map(listing => <li key={listing.id}>{listing.name}</li>)}</ul>
        </section>
    );
};
