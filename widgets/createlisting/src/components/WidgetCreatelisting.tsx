import { useEffect, useState } from "react";
import { ListingForm } from "./ListingForm.tsx";
import { loadListings, saveListing, type Listing } from "../lib/listings.ts";
import type { WidgetConfig } from "../Config";
import { useProductData } from "../hooks/domain/useProductData";
import type {BootstrapData} from "../entrypoints/ssr";

type Props = {
    config: WidgetConfig;
    bootstrap?: BootstrapData;
};

export const WidgetCreatelisting = ({
     config,
     bootstrap
 }: Props) => {
    const {
        productData,
        productError,
        productLoading,
    } = useProductData(config.runtime.sku, bootstrap);

    const [creating, setCreating] = useState(false);
    const [listings, setListings] = useState<Listing[]>([]);
    const [listingError, setListingError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        let active = true;
        void loadListings().then(records => { if (active) setListings(records); })
            .catch(() => { if (active) setListingError('Unable to load saved listings.'); });
        return () => { active = false; };
    }, []);

    const save = async (name: string) => {
        setMessage('');
        const listing = await saveListing(name);
        setListings(current => [...current, listing]);
        setMessage(`Listing “${listing.name}” saved.`);
    };

    return (
        <section className="word-editor listing-workspace">
            <header className="word-editor__header">
                <h1
                    data-createlisting-title
                    className="word-editor__title"
                    style={{ color: config.settings.colour }}
                >
                    {config.data.title}
                </h1>
                <p className="word-editor__subtitle">
                    Listing capabilities
                </p>
            </header>

            <div className="word-editor__workspace">
                <aside className="word-editor__block-palette" aria-label="Listing capabilities">
                    <h2 className="word-editor__block-palette-title">Capabilities</h2>
                    <ul className="listing-workspace__capabilities">
                        <li>
                            <button type="button" className="word-editor__block" aria-pressed={creating}
                                onClick={() => { setCreating(true); setMessage(''); }}>
                                Create listing
                            </button>
                        </li>
                        {['Edit listing', 'Delete listing'].map(capability => (
                            <li key={capability} className="word-editor__block">
                                {capability}
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className="word-editor__document-area">
                    <div className="word-editor__document listing-workspace__content">
                        {creating && <ListingForm onSave={save} />}
                        {message && <p role="status">{message}</p>}
                        {listingError && <p role="alert">{listingError}</p>}
                        {listings.length > 0 && (
                            <section aria-label="Saved listings">
                                <h2>Saved listings</h2>
                                <ul>{listings.map(listing => <li key={listing.id}>{listing.name}</li>)}</ul>
                            </section>
                        )}
                        {productLoading && <p role="status">Loading product...</p>}
                        {productError && <p role="alert">Unable to load product.</p>}
                        {!productLoading && !productError && productData && (
                            <dl data-createlisting-product>
                                <dt>SKU</dt>
                                <dd>{productData.sku}</dd>
                                <dt>Name</dt>
                                <dd>{productData.name}</dd>
                            </dl>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
