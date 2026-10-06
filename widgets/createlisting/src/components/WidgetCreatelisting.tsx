import { useEffect, useId, useMemo, useState, type FormEvent } from 'react';
import type { WidgetConfig } from '../Config.ts';
import { Header } from '../../../editorword/src/components/Header.tsx';
import { ListingInputSchema, type Listing } from '../models/listing.ts';
import { listingClient } from '../services/listings/client.ts';

export const WidgetCreatelisting = ({ config }: { config: WidgetConfig }) => {
    const client = useMemo(() => listingClient(config.settings.listingsApi), [config.settings.listingsApi]);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const nameId = useId();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [editing, setEditing] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [deleting, setDeleting] = useState<Listing | null>(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setLoadFailed(false);
        client.list().then(records => { if (active) { setListings(records); setError(''); } })
            .catch(error => { if (active) { setLoadFailed(true); setError(error instanceof Error ? error.message : 'Unable to load listings.'); } })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [client, attempt]);

    const reset = () => { setEditing(null); setName(''); };
    const save = async (event: FormEvent) => {
        event.preventDefault();
        const input = ListingInputSchema.safeParse({ name });
        if (!input.success) { setError(input.error.issues[0]?.message || 'Enter a valid listing name.'); return; }
        setBusy(true); setError(''); setMessage('');
        try {
            const record = await client.save(editing, input.data.name);
            setListings(current => editing ? current.map(item => item.id === record.id ? record : item) : [...current, record]);
            setMessage(editing ? 'Listing updated.' : 'Listing created.');
            reset();
        } catch (error) { setError(error instanceof Error ? error.message : 'Unable to save listing.'); }
        finally { setBusy(false); }
    };
    const remove = async () => {
        if (!deleting) return;
        setBusy(true); setError(''); setMessage('');
        try {
            await client.delete(deleting.id);
            setListings(current => current.filter(item => item.id !== deleting.id));
            if (editing === deleting.id) reset();
            setDeleting(null); setMessage('Listing deleted.');
        } catch (error) { setError(error instanceof Error ? error.message : 'Unable to delete listing.'); }
        finally { setBusy(false); }
    };

    return <section className="word-editor listing-editor" aria-label="Listing manager">
        <Header config={config} subtitle="Create and manage your listings" />
        {error && <p role="alert">{error}</p>}
        {loadFailed && <button type="button" onClick={() => setAttempt(current => current + 1)}>Retry loading</button>}
        {message && <p role="status">{message}</p>}
        <div className="word-editor__workspace listing-editor__workspace">
            <aside className="word-editor__block-palette">
                <h2 className="word-editor__block-palette-title">Listings</h2>
                {loading ? <p role="status">Loading listings…</p> : <>
                    {loadFailed ? <p>Listings are unavailable.</p> : !listings.length && <p>No listings yet.</p>}
                    <ul className="listing-editor__records">
                        {listings.map(record => <li key={record.id}>
                            <span>{record.name}</span>
                            <div className="listing-editor__actions">
                                <button type="button" disabled={busy || !!deleting} aria-label={`Edit ${record.name}`}
                                    onClick={() => { setEditing(record.id); setName(record.name); setError(''); setMessage(''); }}>Edit</button>
                                <button type="button" disabled={busy || !!deleting} aria-label={`Delete ${record.name}`}
                                    onClick={() => { setDeleting(record); setError(''); setMessage(''); }}>Delete</button>
                            </div>
                        </li>)}
                    </ul>
                </>}
            </aside>
            <div className="word-editor__document-area">
                <form className="word-editor__document listing-editor__form" onSubmit={event => { void save(event); }}>
                    <h2>{editing ? 'Edit listing' : 'Create listing'}</h2>
                    <label htmlFor={nameId}>Listing name</label>
                    <input id={nameId} name="name" value={name} maxLength={50} required
                        disabled={busy || loading || loadFailed || !!deleting} onChange={event => setName(event.target.value)} />
                    <small>{name.length}/50 characters</small>
                    <div className="word-editor__save-or-export">
                        {editing && <button type="button" disabled={busy || !!deleting} onClick={reset}>Cancel edit</button>}
                        <button type="submit" disabled={busy || loading || loadFailed || !!deleting}>{busy && !deleting ? 'Saving…' : editing ? 'Save changes' : 'Create listing'}</button>
                    </div>
                </form>
                {deleting && <div role="alertdialog" aria-label="Delete listing" className="listing-editor__confirmation">
                    <p>Delete “{deleting.name}”?</p>
                    <div className="listing-editor__actions">
                        <button type="button" disabled={busy} onClick={() => { void remove(); }}>Confirm delete</button>
                        <button type="button" disabled={busy} onClick={() => setDeleting(null)}>Cancel</button>
                    </div>
                </div>}
            </div>
        </div>
    </section>;
};
