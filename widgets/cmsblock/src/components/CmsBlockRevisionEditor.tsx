import {CmsBlockRenderedPreview} from './CmsBlockRenderedPreview.tsx';
import type {CmsBlockController} from '../controller/useCmsBlockController.ts';
import {useCmsBlockRevisionDraft} from './useCmsBlockRevisionDraft.ts';

type Props = {controller: CmsBlockController; onDirtyChange: (dirty: boolean) => void};

export function CmsBlockRevisionEditor({controller, onDirtyChange}: Props) {
    const pending = controller.record?.pending;
    const draft = useCmsBlockRevisionDraft({controller, pending, onDirtyChange});
    if (!pending) return null;

    return (
        <div className="cmsblock-editor__revision">
            <div className="cmsblock-editor__revision-code">
                <label>Generated HTML
                    <textarea aria-label="Generated HTML" value={draft.html} rows={13}
                        onChange={event => draft.setHtml(event.target.value)} />
                </label>
                <label>Generated CSS
                    <textarea aria-label="Generated CSS" value={draft.css} rows={13}
                        onChange={event => draft.setCss(event.target.value)} />
                </label>
            </div>
            <h3>Live preview</h3>
            <CmsBlockRenderedPreview title="Generated CMSBlock draft"
                revision={{...pending, html: draft.html, css: draft.css}} />
            <div className="cmsblock-editor__actions">
                <button type="button" disabled={draft.busy || !draft.dirty} onClick={() => { void draft.save(); }}>
                    Save HTML/CSS
                </button>
                <button type="button" disabled={draft.busy || !draft.dirty} onClick={draft.discard}>
                    Discard manual changes
                </button>
                {draft.dirty && <span>Unsaved manual changes</span>}
                {draft.message && <span role="status">{draft.message}</span>}
                {draft.error && <span role="alert">{draft.error}</span>}
            </div>
            <p>Save manual edits before approving. The original submitted source is unchanged.</p>
        </div>
    );
}
