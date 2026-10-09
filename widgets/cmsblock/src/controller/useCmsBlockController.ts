import {useState} from 'react';
import type {WidgetConfig} from '../Config.ts';
import type {CmsBlockDraft, CmsBlockTemplateId} from '../Model/CmsBlock.ts';

export function useCmsBlockController(config: WidgetConfig) {
    const initialDraft = (): CmsBlockDraft => ({
        source: {...config.data.source},
        templateId: config.data.templateId,
    });

    const [draft, setDraft] = useState<CmsBlockDraft>(initialDraft);
    const [showSourcePreview, setShowSourcePreview] = useState(false);

    const changed =
        draft.source.content !== config.data.source.content ||
        draft.source.format !== config.data.source.format ||
        draft.templateId !== config.data.templateId;

    const updateContent = (content: string) =>
        setDraft(current => ({...current, source: {...current.source, content}}));

    const updateFormat = (format: CmsBlockDraft['source']['format']) =>
        setDraft(current => ({...current, source: {...current.source, format}}));

    const updateTemplate = (templateId: CmsBlockTemplateId) =>
        setDraft(current => ({...current, templateId}));

    const reset = () => setDraft(initialDraft());

    return {
        draft, changed, showSourcePreview, setShowSourcePreview,
        updateContent, updateFormat, updateTemplate, reset,
    };
}

export type CmsBlockController = ReturnType<typeof useCmsBlockController>;
