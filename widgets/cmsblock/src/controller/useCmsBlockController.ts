import {useEffect, useState} from 'react';
import type {WidgetConfig} from '../Config.ts';
import type {CmsBlockDraft, CmsBlockTemplateId} from '../Model/CmsBlock.ts';
import {CmsBlockApi, type CmsBlockRecord} from '../Model/CmsBlockApi.ts';

export function useCmsBlockController(config: WidgetConfig) {
    const initialDraft = (): CmsBlockDraft => ({
        source: {...config.data.source},
        templateId: config.data.templateId,
    });

    const [draft, setDraft] = useState<CmsBlockDraft>(initialDraft);
    const [savedDraft, setSavedDraft] = useState<CmsBlockDraft>(initialDraft);
    const [record, setRecord] = useState<CmsBlockRecord | null>(null);
    const [busy, setBusy] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [mode, setMode] = useState<'edit' | 'review' | 'view'>('edit');
    const [showSourcePreview, setShowSourcePreview] = useState(false);

    useEffect(() => {
        let active = true;
        void CmsBlockApi.get()
            .then(found => {
                if (!active || !found) return;
                setRecord(found);
                setSavedDraft({source: found.source, templateId: found.templateId});
                setDraft({source: found.source, templateId: found.templateId});
                if (found.pending) setMode('review');
                else if (found.published) setMode('view');
            })
            .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : 'Could not load CMSBlock.'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const changed = JSON.stringify(draft) !== JSON.stringify(savedDraft);

    const updateContent = (content: string) => setDraft(current => ({
        ...current, source: {...current.source, content},
    }));
    const updateFormat = (format: CmsBlockDraft['source']['format']) => setDraft(current => ({
        ...current, source: {...current.source, format},
    }));
    const updateTemplate = (templateId: CmsBlockTemplateId) => setDraft(current => ({
        ...current, templateId,
    }));
    const reset = () => setDraft({...savedDraft, source: {...savedDraft.source}});

    const execute = async (operation: () => Promise<CmsBlockRecord | null>, success: string) => {
        setBusy(true);
        setError('');
        setMessage('');
        try {
            const next = await operation();
            if (!next) throw new Error('The CMSBlock service returned an empty record.');
            setRecord(next);
            setMessage(success);
            return next;
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'CMSBlock request failed.');
            return null;
        } finally {
            setBusy(false);
        }
    };

    const save = async () => {
        if (!draft.source.content.trim()) {
            setError('Enter content before saving.');
            return;
        }
        const next = await execute(() => CmsBlockApi.save(draft), 'Source and template saved.');
        if (next) {
            setSavedDraft({source: next.source, templateId: next.templateId});
            setMode('edit');
        }
    };

    const generate = async () => {
        if (changed) { setError('Save your changes before generating.'); return; }
        const next = await execute(CmsBlockApi.generate, 'Generated draft ready for review.');
        if (next?.pending) setMode('review');
    };

    const approve = async () => {
        const next = await execute(CmsBlockApi.approve, 'Block approved and published.');
        if (next) setMode('view');
    };
    const reject = async () => {
        const next = await execute(CmsBlockApi.reject, 'Draft rejected; previously published block remains unchanged.');
        if (next) setMode('edit');
    };

    return {
        draft, record, changed, busy, loading, error, message, mode, setMode,
        showSourcePreview, setShowSourcePreview,
        updateContent, updateFormat, updateTemplate, reset, save, generate, approve, reject,
    };
}

export type CmsBlockController = ReturnType<typeof useCmsBlockController>;
