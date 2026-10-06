import { useEffect, useState } from 'react';
import { Listing, type ListingRecord } from '../Model/Listing.ts';

export type ListingMode = 'create' | 'edit' | 'delete';

const listingModel = new Listing();

export function useListingController() {
    const [mode, setMode] = useState<ListingMode | null>(null);
    const [selectedId, setSelectedId] = useState('');
    const [busy, setBusy] = useState(false);
    const [listings, setListings] = useState<ListingRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const selected = listings.find(listing => listing.id === selectedId);

    useEffect(() => {
        let active = true;
        void listingModel.list().then(records => { if (active) setListings(records); })
            .catch(error => { if (active) setError(error instanceof Error ? error.message : 'Unable to load saved listings.'); })
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
            setError('');
            if (mode === 'edit') { setMode(null); setSelectedId(''); }
        } finally { setBusy(false); }
    };

    const remove = async () => {
        if (!selected) return;
        setBusy(true);
        setError('');
        setMessage('');
        try {
            await listingModel.delete(selected.id);
            setListings(current => current.filter(record => record.id !== selected.id));
            setMessage(`Listing “${selected.name}” deleted.`);
            setSelectedId('');
            setMode(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unable to delete listing.');
        } finally { setBusy(false); }
    };

    const begin = (action: ListingMode) => {
        setMode(action);
        setSelectedId('');
        setMessage('');
        setError('');
    };

    const select = (id: string) => {
        setSelectedId(id);
        setError('');
    };

    const cancel = () => {
        setMode(null);
        setSelectedId('');
    };

    return {
        mode, listings, selected, selectedId, busy, loading, error, message,
        disabled: busy || loading,
        begin, select, cancel, save, remove,
    };
}

export type ListingController = ReturnType<typeof useListingController>;
