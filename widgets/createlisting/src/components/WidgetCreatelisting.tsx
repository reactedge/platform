import { useEffect, useState } from "react";
import { ListingForm } from "./ListingForm.tsx";
import { Listing, type ListingRecord } from "../Model/Listing.ts";
import { ListingSelector } from "./ListingSelector.tsx";
import type { WidgetConfig } from "../Config";

type Props = {
    config: WidgetConfig;
};

const listingModel = new Listing();

export const WidgetCreatelisting = ({ config }: Props) => {
    const [mode, setMode] = useState<'create' | 'edit' | 'delete' | null>(null);
    const [selectedId, setSelectedId] = useState('');
    const [busy, setBusy] = useState(false);
    const [listings, setListings] = useState<ListingRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [listingError, setListingError] = useState('');
    const [message, setMessage] = useState('');
    const selected = listings.find(listing => listing.id === selectedId);

    useEffect(() => {
        let active = true;
        void listingModel.list().then(records => { if (active) setListings(records); })
            .catch(error => { if (active) setListingError(error instanceof Error ? error.message : 'Unable to load saved listings.'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const save = async (name: string) => {
        setMessage('');
        setBusy(true);
        try {
            const listing = mode === 'edit' && selected
                ? await listingModel.update(selected.id, name) : await listingModel.create(name);
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
            await listingModel.delete(selected.id);
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
                                    disabled={busy || loading} onClick={() => { setMode(action); setSelectedId(''); setMessage(''); setListingError(''); }}>
                                    {action === 'create' ? 'Create listing' : action === 'edit' ? 'Edit listing' : 'Delete listing'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className="word-editor__document-area">
                    <div className="word-editor__document listing-workspace__content">
                        {mode === 'create' && <ListingForm key="create" onSave={save} onCancel={() => setMode(null)} />}
                        {(mode === 'edit' || mode === 'delete') && (
                            <ListingSelector listings={listings} selectedId={selectedId} action={mode}
                                disabled={busy || loading} onSelect={id => { setSelectedId(id); setListingError(''); }} />
                        )}
                        {mode === 'edit' && selected && <ListingForm key={selected.id} editing initialName={selected.name}
                            onSave={save} onCancel={() => { setMode(null); setSelectedId(''); }} />}
                        {mode === 'delete' && selected && (
                            <section className="listing-workspace__confirmation" aria-label="Confirm deletion">
                                <p>Delete listing “{selected.name}”? This cannot be undone.</p>
                                <button type="button" className="listing-workspace__danger" disabled={busy} onClick={() => { void remove(); }}>{busy ? 'Deleting…' : 'Confirm delete'}</button>
                                <button type="button" disabled={busy} onClick={() => { setMode(null); setSelectedId(''); }}>Cancel</button>
                            </section>
                        )}
                        {loading && <p role="status">Loading listings…</p>}
                        {!loading && !mode && <p className="listing-workspace__intro">Choose a capability to create, edit or delete a listing.</p>}
                        {message && <p className="listing-workspace__status" role="status">{message}</p>}
                        {listingError && <p className="listing-workspace__error" role="alert">{listingError}</p>}
                        {listings.length > 0 && (
                            <section className="listing-workspace__saved" aria-label="Saved listings">
                                <h2>Saved listings <span className="listing-workspace__count">{listings.length}</span></h2>
                                <ul>{listings.map(listing => <li key={listing.id}>{listing.name}</li>)}</ul>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
