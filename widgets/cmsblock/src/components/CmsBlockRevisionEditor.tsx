import { CmsBlockRenderedPreview } from "./CmsBlockRenderedPreview.tsx";
import type { CmsBlockController } from "../hooks/domain/useCmsBlockController.ts";
import { useCmsBlockRevisionDraft } from "../hooks/domain/useCmsBlockRevisionDraft.ts";

type Props = { controller: CmsBlockController; onDirtyChange: (dirty: boolean) => void };

export function CmsBlockRevisionEditor({ controller, onDirtyChange }: Props) {
    const pending = controller.record?.pending;
    const draft = useCmsBlockRevisionDraft({ controller, pending, onDirtyChange });
    if (!pending) return null;

    return (
        <div className="cmsblock-editor__revision">
            <label className="cmsblock-editor__revision-html">Generated HTML
                <textarea aria-label="Generated HTML" value={draft.html} rows={13}
                    onChange={event => draft.setHtml(event.target.value)} />
            </label>
            <h3>Live preview</h3>
            <CmsBlockRenderedPreview
                title="Generated CMSBlock draft"
                revision={{ ...pending, html: draft.html }}
                templateId={controller.draft.templateId}
                layoutId={controller.draft.layoutId}
            />
            <div className="cmsblock-editor__actions">
                <button type="button" disabled={draft.busy || !draft.dirty} onClick={() => { void draft.save(); }}>
                    Save HTML
                </button>
                <button type="button" disabled={draft.busy || !draft.dirty} onClick={draft.discard}>
                    Discard manual changes
                </button>
                {draft.dirty && <span>Unsaved manual changes</span>}
                {draft.message && <span role="status">{draft.message}</span>}
                {draft.error && <span role="alert">{draft.error}</span>}
            </div>
            <p>Save HTML edits before approving. Styling comes from the selected widget style.</p>
        </div>
    );
}
