import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import type { ListingStatus, ListingUpdateInput } from '../Model/Listing.ts';

type Props = {
    initialName?: string;
    initialStatus?: ListingStatus;
    editing?: boolean;
    onCancel: () => void;
    onSave: (input: ListingUpdateInput) => void | Promise<void>;
};

export const ListingForm = (props: Props) => {
    const {onSave, initialName = '', initialStatus = 'active', editing = false, onCancel} = props;
    const [name, setName] = useState(initialName);
    const [status, setStatus] = useState<ListingStatus>(initialStatus);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const nameId = useId();
    const statusId = useId();
    const input = useRef<HTMLInputElement>(null);

    useEffect(() => { input.current?.focus(); }, []);

    const save = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName || trimmedName.length > 50) {
            setError('Enter a listing name between 1 and 50 characters.');
            return;
        }

        setSaving(true);
        setError('');
        try {
            await onSave({name: trimmedName, status});
            if (!editing) {
                setName('');
                setStatus('active');
            }
            input.current?.focus();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to save the listing.';
            setError(`${message} Your entered details have been kept.`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form className="listing-workspace__form" onSubmit={event => { void save(event); }}>
            <h2>{editing ? 'Edit listing' : 'Create listing'}</h2>

            <label htmlFor={nameId}>Listing name</label>
            <input ref={input} id={nameId} value={name} maxLength={50} required
                disabled={saving} onChange={event => setName(event.target.value)} />

            <label htmlFor={statusId}>Status</label>
            <select id={statusId} value={status} disabled={saving}
                onChange={event => setStatus(event.target.value as ListingStatus)}>
                <option value="active">Active</option>
                <option value="disable">Disabled</option>
                <option value="inreview">In review</option>
            </select>

            {error && <p role="alert">{error}</p>}

            <div className="word-editor__save-or-export">
                <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save listing'}</button>
                <button type="button" disabled={saving} onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};
