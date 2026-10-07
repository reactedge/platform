import type { ListingController } from '../controller/useListingController.ts';
import { ListingForm } from './ListingForm.tsx';
import { ListingSelector } from './ListingSelector.tsx';
import { ListingDeleteConfirmation } from './ListingDeleteConfirmation.tsx';

type Props = {
    controller: ListingController;
    selectedProductCount: number;
};

export const ListingEditor = ({ controller, selectedProductCount }: Props) => {
    const { mode, listings, selectedId, selected, disabled, busy, select, save, remove, cancel } = controller;

    if (mode === 'create') return <ListingForm key="create" onSave={save} onCancel={cancel} />;
    if (!mode) return null;

    return (
        <>
            <ListingSelector listings={listings} selectedId={selectedId} action={mode}
                disabled={disabled} onSelect={select} />
            {mode === 'edit' && selected && <ListingForm key={selected.id} editing
                initialName={selected.name} initialStatus={selected.status}
                onSave={save} onCancel={cancel} />}
            {mode === 'delete' && selected && <ListingDeleteConfirmation listing={selected}
                productCount={selectedProductCount} busy={busy} onConfirm={remove} onCancel={cancel} />}
        </>
    );
};
