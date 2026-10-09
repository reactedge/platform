import {useId} from 'react';
import {CMS_BLOCK_TEMPLATES, type CmsBlockDraft, type CmsBlockTemplateId} from '../Model/CmsBlock.ts';
import type {CmsBlockController} from '../controller/useCmsBlockController.ts';

type Props = {
    controller: CmsBlockController;
};

export const CmsBlockEditor = ({controller}: Props) => {
    const contentId = useId();
    const formatId = useId();
    const templateId = useId();
    const {draft} = controller;

    return (
        <div className="cmsblock-editor__fields">
            <label htmlFor={contentId}>Source content</label>
            <textarea
                id={contentId}
                rows={12}
                value={draft.source.content}
                onChange={event => controller.updateContent(event.target.value)}
                placeholder="Paste text or HTML here"
            />
            <div className="cmsblock-editor__options">
                <div>
                    <label htmlFor={formatId}>Content format</label>
                    <select
                        id={formatId}
                        value={draft.source.format}
                        onChange={event => controller.updateFormat(event.target.value as CmsBlockDraft['source']['format'])}
                    >
                        <option value="text">Plain text</option>
                        <option value="html">HTML source</option>
                    </select>
                </div>
                <div>
                    <label htmlFor={templateId}>Template</label>
                    <select
                        id={templateId}
                        value={draft.templateId}
                        onChange={event => controller.updateTemplate(event.target.value as CmsBlockTemplateId)}
                    >
                        {CMS_BLOCK_TEMPLATES.map(template =>
                            <option key={template.id} value={template.id}>{template.label}</option>
                        )}
                    </select>
                </div>
            </div>
        </div>
    );
};
