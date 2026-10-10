import {useState} from 'react';
import {CmsBlockEditor} from './CmsBlockEditor.tsx';
import {CmsBlockSourcePreview} from './CmsBlockSourcePreview.tsx';
import {CmsBlockRenderedPreview} from './CmsBlockRenderedPreview.tsx';
import {CmsBlockRevisionEditor} from './CmsBlockRevisionEditor.tsx';
import type {CmsBlockController} from '../controller/useCmsBlockController.ts';

type Props = {controller: CmsBlockController};

export const CmsBlockModeNavigation = ({controller}: Props) => {
    const {record, mode} = controller;
    return (
        <nav className="cmsblock-editor__actions" aria-label="CMSBlock modes">
            <button type="button" onClick={() => controller.setMode('edit')}
                aria-pressed={mode === 'edit'}>Edit</button>
            <button type="button" onClick={() => controller.setMode('review')}
                disabled={!record?.pending} aria-pressed={mode === 'review'}>Review</button>
            <button type="button" onClick={() => controller.setMode('view')}
                disabled={!record?.published} aria-pressed={mode === 'view'}>View</button>
        </nav>
    );
};

export const CmsBlockFeedback = ({controller}: Props) => (
    <>
        {controller.loading && <p role="status">Loading saved CMSBlock…</p>}
        {controller.error && <p className="cmsblock-editor__error" role="alert">{controller.error}</p>}
        {controller.message && <p className="cmsblock-editor__message" role="status">{controller.message}</p>}
    </>
);

const CmsBlockEditActions = ({controller}: Props) => {
    const {record, busy, changed, showSourcePreview} = controller;
    const saveDisabled = busy || (!changed && Boolean(record));
    const generateDisabled = busy || !record || changed;
    return (
        <div className="cmsblock-editor__actions">
            <button type="button" disabled={saveDisabled}
                onClick={() => { void controller.save(); }}>Save source</button>
            <button type="button" disabled={generateDisabled}
                onClick={() => { void controller.generate(); }}>Generate draft</button>
            <button type="button" disabled={busy || !changed}
                onClick={controller.reset}>Reset changes</button>
            <button type="button" disabled={busy} onClick={() =>
                controller.setShowSourcePreview(!showSourcePreview)}>
                {showSourcePreview ? 'Hide source preview' : 'Inspect source'}
            </button>
            <span>{changed ? 'Unsaved working copy' : 'Changes saved'}</span>
        </div>
    );
};

const CmsBlockEditPreviews = ({controller}: Props) => (
    <>
        {controller.showSourcePreview && <CmsBlockSourcePreview draft={controller.draft} />}
        {controller.record?.published && <p>
            Published revision {controller.record.published.revision} remains live while editing.
        </p>}
    </>
);

export const CmsBlockEditMode = ({controller}: Props) => (
    <>
        <CmsBlockEditor controller={controller} />
        <CmsBlockEditActions controller={controller} />
        <CmsBlockEditPreviews controller={controller} />
    </>
);

export const CmsBlockReviewMode = ({controller}: Props) => {
    const {record, busy} = controller;
    const [unsavedEdits, setUnsavedEdits] = useState(false);
    if (!record?.pending) return null;
    return (
        <>
            <h2>Review generated revision {record.pending.revision}</h2>
            <CmsBlockRevisionEditor controller={controller} onDirtyChange={setUnsavedEdits} />
            <div className="cmsblock-editor__actions">
                <button type="button" disabled={busy || unsavedEdits} onClick={() => { void controller.approve(); }}>Approve and publish</button>
                <button type="button" disabled={busy} onClick={() => { void controller.reject(); }}>Reject draft</button>
            </div>
            {record.published && <p>Published revision {record.published.revision} is unchanged until approval.</p>}
        </>
    );
};

export const CmsBlockViewMode = ({controller}: Props) => {
    const published = controller.record?.published;
    if (!published) return null;
    return (
        <>
            <h2>Published revision {published.revision}</h2>
            <CmsBlockRenderedPreview title="Published CMSBlock" revision={published} />
        </>
    );
};
