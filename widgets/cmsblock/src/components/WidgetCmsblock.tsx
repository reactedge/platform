import type {WidgetConfig} from '../Config.ts';
import {CmsBlockEditor} from './CmsBlockEditor.tsx';
import {CmsBlockSourcePreview} from './CmsBlockSourcePreview.tsx';
import {CmsBlockRenderedPreview} from './CmsBlockRenderedPreview.tsx';
import {useCmsBlockController} from '../controller/useCmsBlockController.ts';

type Props = {config: WidgetConfig};

export const WidgetCmsblock = ({config}: Props) => {
    const controller = useCmsBlockController(config);
    const {record, busy, loading, mode} = controller;

    return (
        <section className="cmsblock-editor" aria-label="CMS block editor">
            <header className="cmsblock-editor__header">
                <h1 data-cmsblock-title style={{color: config.settings.colour}}>
                    {config.data.title}
                </h1>
                <p>Author, generate, review and publish a responsive content block.</p>
            </header>

            <nav className="cmsblock-editor__actions" aria-label="CMSBlock modes">
                <button type="button" onClick={() => controller.setMode('edit')}
                    aria-pressed={mode === 'edit'}>Edit</button>
                <button type="button" onClick={() => controller.setMode('review')}
                    disabled={!record?.pending} aria-pressed={mode === 'review'}>Review</button>
                <button type="button" onClick={() => controller.setMode('view')}
                    disabled={!record?.published} aria-pressed={mode === 'view'}>View</button>
            </nav>

            {loading && <p role="status">Loading saved CMSBlock…</p>}
            {controller.error && <p className="cmsblock-editor__error" role="alert">{controller.error}</p>}
            {controller.message && <p className="cmsblock-editor__message" role="status">{controller.message}</p>}

            {!loading && mode === 'edit' && <>
                <CmsBlockEditor controller={controller} />
                <div className="cmsblock-editor__actions">
                    <button type="button" disabled={busy || !controller.changed && Boolean(record)}
                        onClick={() => { void controller.save(); }}>Save source</button>
                    <button type="button" disabled={busy || !record || controller.changed}
                        onClick={() => { void controller.generate(); }}>Generate draft</button>
                    <button type="button" disabled={busy || !controller.changed}
                        onClick={controller.reset}>Reset changes</button>
                    <button type="button" disabled={busy} onClick={() =>
                        controller.setShowSourcePreview(!controller.showSourcePreview)}>
                        {controller.showSourcePreview ? 'Hide source preview' : 'Inspect source'}
                    </button>
                    <span>{controller.changed ? 'Unsaved working copy' : 'Changes saved'}</span>
                </div>
                {controller.showSourcePreview && <CmsBlockSourcePreview draft={controller.draft} />}
                {record?.published && <p>Published revision {record.published.revision} remains live while editing.</p>}
            </>}

            {!loading && mode === 'review' && record?.pending && <>
                <h2>Review generated revision {record.pending.revision}</h2>
                <CmsBlockRenderedPreview title="Generated CMSBlock draft" revision={record.pending} />
                <div className="cmsblock-editor__actions">
                    <button type="button" disabled={busy} onClick={() => { void controller.approve(); }}>Approve and publish</button>
                    <button type="button" disabled={busy} onClick={() => { void controller.reject(); }}>Reject draft</button>
                </div>
                {record.published && <p>Published revision {record.published.revision} is unchanged until approval.</p>}
            </>}

            {!loading && mode === 'view' && record?.published && <>
                <h2>Published revision {record.published.revision}</h2>
                <CmsBlockRenderedPreview title="Published CMSBlock" revision={record.published} />
            </>}
        </section>
    );
};
