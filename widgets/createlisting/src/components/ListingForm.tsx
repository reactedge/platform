import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

type Props = {
    initialName?: string;
    editing?: boolean;
    onCancel: () => void;
    onSave: (name: string) => void | Promise<void>;
};

export const ListingForm = ({ onSave, initialName = '', editing = false, onCancel }: Props) => {
    const [name, setName] = useState(initialName);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const inputId = useId();
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
            await onSave(trimmedName);
            if (!editing) setName('');
            input.current?.focus();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to save the listing.';
            setError(`${message} Your entered name has been kept.`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form className="listing-workspace__form" onSubmit={event => { void save(event); }}>
            <h2>{editing ? 'Edit listing' : 'Create listing'}</h2>
            <label htmlFor={inputId}>Listing name</label>
            <input ref={input} id={inputId} value={name} maxLength={50} required
                disabled={saving} onChange={event => setName(event.target.value)} />
            {error && <p role="alert">{error}</p>}
            <div className="word-editor__save-or-export">
                <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save listing'}</button>
                <button type="button" disabled={saving} onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};
