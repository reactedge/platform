import type { ListingRecord } from '../Model/Listing.ts';
import type { ProductRecord } from '../Model/Product.ts';

type Props = {
    listings: ListingRecord[];
    products: ProductRecord[];
};

export const SavedListings = ({ listings, products }: Props) => {
    if (listings.length === 0) return null;

    const countProducts = (listingId: string) =>
        products.filter(product => product.listingId === listingId).length;

    return (
        <section className="listing-workspace__saved" aria-label="Saved listings">
            <h2>Saved listings <span className="listing-workspace__count">{listings.length}</span></h2>
            <ul>
                {listings.map(listing => {
                    const productCount = countProducts(listing.id);
                    return (
                        <li key={listing.id}>
                            <span>{listing.name}</span>
                            <span className="listing-workspace__product-count">
                                {productCount} {productCount === 1 ? 'product' : 'products'}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};
