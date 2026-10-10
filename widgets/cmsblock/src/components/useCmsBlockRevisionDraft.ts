import {useEffect, useState} from 'react';
import type {CmsBlockController} from '../controller/useCmsBlockController.ts';
import {CmsBlockApi, type CmsBlockRecord} from '../Model/CmsBlockApi.ts';

type Props = {
    controller: CmsBlockController;
    pending: CmsBlockRecord['pending'] | undefined;
    onDirtyChange: (dirty: boolean) => void;
};

export function useCmsBlockRevisionDraft({controller, pending, onDirtyChange}: Props) {
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

    const dirty = Boolean(pending && (html !== pending.html || css !== pending.css));
    useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);

    const save = async () => {
        if (!pending) return;
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
        } finally {
            setBusy(false);
        }
    };

    const discard = () => {
        if (!pending) return;
        setHtml(pending.html);
        setCss(pending.css);
    };

    return {html, setHtml, css, setCss, busy, error, message, dirty, save, discard};
}
