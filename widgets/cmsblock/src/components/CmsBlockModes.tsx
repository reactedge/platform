import {useState} from 'react';
import {CmsBlockEditor} from './CmsBlockEditor.tsx';
import {CmsBlockSourcePreview} from './CmsBlockSourcePreview.tsx';
import {CmsBlockPublishedContent} from './CmsBlockPublishedContent.tsx';
import {CmsBlockRevisionEditor} from './CmsBlockRevisionEditor.tsx';
import {useCmsBlockControllerContext} from '../state/CmsBlock/CmsBlockControllerContext.tsx';

export const CmsBlockModeNavigation = () => {
    const cmsBlock = useCmsBlockControllerContext();
    const {record, mode, setMode} = cmsBlock;
    return (
        <nav className="cmsblock-editor__actions" aria-label="CMSBlock modes">
            <button type="button" onClick={() => setMode('edit')}
                aria-pressed={mode === 'edit'}>Edit</button>
            <button type="button" onClick={() => setMode('review')}
                disabled={!record?.pending} aria-pressed={mode === 'review'}>Review</button>
            <button type="button" onClick={() => setMode('view')}
                disabled={!record?.published} aria-pressed={mode === 'view'}>View</button>
        </nav>
    );
};

export const CmsBlockFeedback = () => {
    const {loading, error, message} = useCmsBlockControllerContext();
    return (
        <>
            {loading && <p role="status">Loading saved CMSBlock…</p>}
            {error && <p className="cmsblock-editor__error" role="alert">{error}</p>}
            {message && <p className="cmsblock-editor__message" role="status">{message}</p>}
        </>
    );
};

const CmsBlockEditActions = () => {
    const cmsBlock = useCmsBlockControllerContext();
    const {record, busy, changed, showSourcePreview, save, generate, reset, setShowSourcePreview} = cmsBlock;
    const saveDisabled = busy || (!changed && Boolean(record));
    const generateDisabled = busy || !record || changed;
    return (
        <div className="cmsblock-editor__actions">
            <button type="button" disabled={saveDisabled}
                onClick={() => { void save(); }}>Save source</button>
            <button type="button" disabled={generateDisabled}
                onClick={() => { void generate(); }}>Generate draft</button>
            <button type="button" disabled={busy || !changed}
                onClick={reset}>Reset changes</button>
            <button type="button" disabled={busy} onClick={() =>
                setShowSourcePreview(!showSourcePreview)}>
                {showSourcePreview ? 'Hide source preview' : 'Inspect source'}
            </button>
            <span>{changed ? 'Unsaved working copy' : 'Changes saved'}</span>
        </div>
    );
};

const CmsBlockEditPreviews = () => {
    const {showSourcePreview, draft, record} = useCmsBlockControllerContext();
    return (
        <>
            {showSourcePreview && <CmsBlockSourcePreview draft={draft} />}
            {record?.published && <p>
                Published revision {record.published.revision} remains live while editing.
            </p>}
        </>
    );
};

export const CmsBlockEditMode = () => (
    <>
        <CmsBlockEditor />
        <CmsBlockEditActions />
        <CmsBlockEditPreviews />
    </>
);

export const CmsBlockReviewMode = () => {
    const cmsBlock = useCmsBlockControllerContext();
    const {record, busy, approve, reject} = cmsBlock;
    const [unsavedEdits, setUnsavedEdits] = useState(false);
    if (!record?.pending) return null;
    return (
        <>
            <h2>Review generated revision {record.pending.revision}</h2>
            <CmsBlockRevisionEditor onDirtyChange={setUnsavedEdits} />
            <div className="cmsblock-editor__actions">
                <button type="button" disabled={busy || unsavedEdits} onClick={() => { void approve(); }}>Approve and publish</button>
                <button type="button" disabled={busy} onClick={() => { void reject(); }}>Reject draft</button>
            </div>
            {record.published && <p>Published revision {record.published.revision} is unchanged until approval.</p>}
        </>
    );
};

export const CmsBlockViewMode = () => {
    const {record} = useCmsBlockControllerContext();
    const published = record?.published;
    if (!published) return null;
    return (
        <>
            <h2>Published revision {published.revision}</h2>
            <CmsBlockPublishedContent
                revision={published}
                templateId={record?.templateId ?? "editorial"}
                layoutId={published.layoutId ?? record?.layoutId ?? "image-above"}
            />
        </>
    );
};
