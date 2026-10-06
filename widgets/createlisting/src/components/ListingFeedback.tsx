import type { ListingMode } from '../controller/useListingController.ts';

type Props = {
    loading: boolean;
    mode: ListingMode | null;
    message: string;
    error: string;
};

export const ListingFeedback = ({ loading, mode, message, error }: Props) => (
    <>
        {loading && <p role="status">Loading listings…</p>}
        {!loading && !mode && <p className="listing-workspace__intro">Choose a capability to create, edit or delete a listing.</p>}
        {message && <p className="listing-workspace__status" role="status">{message}</p>}
        {error && <p className="listing-workspace__error" role="alert">{error}</p>}
    </>
);
