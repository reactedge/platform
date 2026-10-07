import { useEffect, useState } from "react";
import { ListingForm } from "./ListingForm.tsx";
import { AddProductPanel } from "./product/AddProductPanel.tsx";
import { ProductCapabilityButton } from "./product/ProductCapabilityButton.tsx";
import { loadListings, saveListing, updateListing, deleteListing, type Listing } from "../lib/listings.ts";
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

    const [mode, setMode] = useState<'create' | 'edit' | 'delete' | 'product' | null>(null);
    const [selectedId, setSelectedId] = useState('');
    const [busy, setBusy] = useState(false);
    const [listings, setListings] = useState<Listing[]>([]);
    const [listingError, setListingError] = useState('');
    const [message, setMessage] = useState('');
    const selected = listings.find(listing => listing.id === selectedId);

    useEffect(() => {
        let active = true;
        void loadListings().then(records => { if (active) setListings(records); })
            .catch(() => { if (active) setListingError('Unable to load saved listings.'); });
        return () => { active = false; };
    }, []);

    const save = async (name: string) => {
        setMessage('');
        setBusy(true);
        try {
            const listing = mode === 'edit' && selected
                ? await updateListing(selected.id, name) : await saveListing(name);
            setListings(current => mode === 'edit'
                ? current.map(record => record.id === listing.id ? listing : record)
                : [...current, listing]);
            setMessage(`Listing “${listing.name}” saved.`);
            setListingError('');
            if (mode === 'edit') { setMode(null); setSelectedId(''); }
        } finally { setBusy(false); }
    };

    const remove = async () => {
        if (!selected) return;
        setBusy(true);
        setListingError('');
        setMessage('');
        try {
            await deleteListing(selected.id);
            setListings(current => current.filter(record => record.id !== selected.id));
            setMessage(`Listing “${selected.name}” deleted.`);
            setSelectedId('');
            setMode(null);
        } catch (error) {
            setListingError(error instanceof Error ? error.message : 'Unable to delete listing.');
        } finally { setBusy(false); }
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
                        {(['create', 'edit', 'delete'] as const).map(action => (
                            <li key={action}>
                                <button type="button" className="word-editor__block" aria-pressed={mode === action}
                                    disabled={busy} onClick={() => { setMode(action); setSelectedId(''); setMessage(''); setListingError(''); }}>
                                    {action === 'create' ? 'Create listing' : action === 'edit' ? 'Edit listing' : 'Delete listing'}
                                </button>
                            </li>
                        ))}
                        <ProductCapabilityButton
                            active={mode === 'product'}
                            disabled={busy}
                            onSelect={() => { setMode('product'); setSelectedId(''); setMessage(''); setListingError(''); }}
                        />
                    </ul>
                </aside>

                <div className="word-editor__document-area">
                    <div className="word-editor__document listing-workspace__content">
                        {mode === 'create' && <ListingForm key="create" onSave={save} onCancel={() => setMode(null)} />}
                        {(mode === 'edit' || mode === 'delete') && (
                            <>
                                <label htmlFor="listing-selection">Select listing to {mode}</label>
                                <select id="listing-selection" value={selectedId} disabled={busy}
                                    onChange={event => { setSelectedId(event.target.value); setListingError(''); }}>
                                    <option value="">Choose a listing</option>
                                    {listings.map(listing => <option key={listing.id} value={listing.id}>{listing.name}</option>)}
                                </select>
                                {listings.length === 0 && <p>No saved listings yet.</p>}
                            </>
                        )}
                        {mode === 'edit' && selected && <ListingForm key={selected.id} editing initialName={selected.name}
                            onSave={save} onCancel={() => { setMode(null); setSelectedId(''); }} />}
                        {mode === 'delete' && selected && (
                            <section aria-label="Confirm deletion">
                                <p>Delete listing “{selected.name}”? This cannot be undone.</p>
                                <button type="button" disabled={busy} onClick={() => { void remove(); }}>{busy ? 'Deleting…' : 'Confirm delete'}</button>
                                <button type="button" disabled={busy} onClick={() => { setMode(null); setSelectedId(''); }}>Cancel</button>
                            </section>
                        )}
                        {mode === 'product' && (
                            <AddProductPanel
                                listings={listings}
                                disabled={busy}
                                onCancel={() => setMode(null)}
                            />
                        )}
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
