import {useEffect, useState} from 'react';
import {CmsBlockRenderedPreview} from './CmsBlockRenderedPreview.tsx';
import type {CmsBlockController} from '../controller/useCmsBlockController.ts';
import {CmsBlockApi} from '../Model/CmsBlockApi.ts';

export function CmsBlockRevisionEditor({controller}: {controller: CmsBlockController}) {
    const pending = controller.record?.pending;
    const [html, setHtml] = useState(pending?.html ?? '');
    const [css, setCss] = useState(pending?.css ?? '');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setHtml(pending?.html ?? '');
        setCss(pending?.css ?? '');
        setError('');
        setMessage('');
    }, [pending?.revision]);

    if (!pending) return null;
    const dirty = html !== pending.html || css !== pending.css;
    const save = async () => {
        setBusy(true);
        setError('');
        setMessage('');
        try {
            const updated = await CmsBlockApi.updatePending({html, css, revision: pending.revision});
            if (!updated?.pending) throw new Error('Pending revision was not returned.');
            controller.setRecord(updated);
            setMessage('Manual changes saved to pending revision.');
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Could not save edits.');
        } finally { setBusy(false); }
    };

    return (
        <div className="cmsblock-editor__revision">
            <div className="cmsblock-editor__revision-code">
                <label>Generated HTML
                    <textarea aria-label="Generated HTML" value={html} rows={13}
                        onChange={event => setHtml(event.target.value)} />
                </label>
                <label>Generated CSS
                    <textarea aria-label="Generated CSS" value={css} rows={13}
                        onChange={event => setCss(event.target.value)} />
                </label>
            </div>
            <h3>Live preview</h3>
            <CmsBlockRenderedPreview title="Generated CMSBlock draft"
                revision={{...pending, html, css}} />
            <div className="cmsblock-editor__actions">
                <button type="button" disabled={busy || !dirty} onClick={() => { void save(); }}>
                    Save HTML/CSS
                </button>
                <button type="button" disabled={busy || !dirty}
                    onClick={() => { setHtml(pending.html); setCss(pending.css); }}>
                    Discard manual changes
                </button>
                {dirty && <span>Unsaved manual changes</span>}
                {message && <span role="status">{message}</span>}
                {error && <span role="alert">{error}</span>}
            </div>
            <p>Save manual edits before approving. The original submitted source is unchanged.</p>
        </div>
    );
}
