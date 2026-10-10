import {useEffect, useState} from 'react';
import type {WidgetConfig} from '../Config.ts';
import {legacyLayoutForTemplate, type CmsBlockDraft, type CmsBlockTemplateId} from '../Model/CmsBlock.ts';
import type {CmsBlockLayoutId} from '../Model/CmsBlockLayout.ts';
import {CmsBlockApi, type CmsBlockRecord, type CmsBlockRevision} from '../Model/CmsBlockApi.ts';

export function useCmsBlockController(config: WidgetConfig, options: {viewOnly?: boolean} = {}) {
    const initialDraft = (): CmsBlockDraft => ({
        source: {...config.data.source},
        templateId: config.data.templateId,
        layoutId: config.data.layoutId ?? legacyLayoutForTemplate(config.data.templateId),
        ...(config.data.image ? {image: config.data.image} : {}),
    });

    const [draft, setDraft] = useState<CmsBlockDraft>(initialDraft);
    const [savedDraft, setSavedDraft] = useState<CmsBlockDraft>(initialDraft);
    const [record, setRecord] = useState<CmsBlockRecord | null>(null);
    const [published, setPublished] = useState<CmsBlockRevision | null>(null);
    const [busy, setBusy] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [mode, setMode] = useState<'edit' | 'review' | 'view'>('edit');
    const [showSourcePreview, setShowSourcePreview] = useState(false);

    useEffect(() => {
        let active = true;
        const load = options.viewOnly ? CmsBlockApi.getPublished() : CmsBlockApi.get();
        void load
            .then(found => {
                if (!active) return;
                if (options.viewOnly) {
                    setPublished(found as CmsBlockRevision | null);
                    setMode('view');
                    return;
                }
                if (!found) return;
                const savedRecord = found as CmsBlockRecord;
                setRecord(savedRecord);
                setPublished(savedRecord.published);
                const saved = {
                    source: savedRecord.source,
                    templateId: savedRecord.templateId,
                    layoutId: savedRecord.layoutId ?? legacyLayoutForTemplate(savedRecord.templateId),
                    ...(savedRecord.image ? {image: savedRecord.image} : {}),
                };
                setSavedDraft(saved);
                setDraft(saved);
                if (savedRecord.pending) setMode('review');
                else if (savedRecord.published) setMode('view');
            })
            .catch(reason => {
                if (!active) return;
                setError(reason instanceof Error ? reason.message : 'Could not load CMSBlock.');
                if (options.viewOnly) setMode('view');
            })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [options.viewOnly]);

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
    const updateImage = (field: 'src' | 'alt', value: string) => setDraft(current => ({
        ...current, image: {...(current.image ?? {src: '', alt: ''}), [field]: value},
    }));
    const updateLayout = (layoutId: CmsBlockLayoutId) => setDraft(current => ({
        ...current, layoutId,
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
            setSavedDraft({
                source: next.source,
                templateId: next.templateId,
                layoutId: next.layoutId ?? legacyLayoutForTemplate(next.templateId),
                ...(next.image ? {image: next.image} : {}),
            });
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
        draft, record, published, setPublished, setRecord, changed, busy, loading, error, message, mode, setMode,
        showSourcePreview, setShowSourcePreview,
        updateContent, updateFormat, updateTemplate, updateLayout, updateImage, reset, save, generate, approve, reject,
    };
}

export type CmsBlockController = ReturnType<typeof useCmsBlockController>;
