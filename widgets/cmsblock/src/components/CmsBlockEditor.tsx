import {useId} from 'react';
import {CMS_BLOCK_TEMPLATES, type CmsBlockDraft} from '../Model/CmsBlock.ts';
import {CMS_BLOCK_REFERENCE_IMAGES} from '../Model/CmsBlockTemplateImages.ts';
import type {CmsBlockController} from '../controller/useCmsBlockController.ts';

type Props = {controller: CmsBlockController};

export const CmsBlockEditor = ({controller}: Props) => {
    const contentId = useId();
    const formatId = useId();
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
            </div>

            <fieldset className="cmsblock-editor__references">
                <legend>Visual reference</legend>
                <p>Select one of the three reference images. The mock generator will match its general composition.</p>
                <div className="cmsblock-editor__reference-list">
                    {CMS_BLOCK_TEMPLATES.map(template => (
                        <button
                            type="button"
                            key={template.id}
                            className="cmsblock-editor__reference"
                            data-template-id={template.id}
                            aria-label={`Use ${template.label} reference`}
                            aria-pressed={draft.templateId === template.id}
                            onClick={() => controller.updateTemplate(template.id)}
                        >
                            <img
                                src={CMS_BLOCK_REFERENCE_IMAGES[template.id]}
                                alt={`${template.label} layout reference image`}
                                loading="lazy"
                            />
                            <strong>{template.label}</strong>
                            <span>{template.description}</span>
                        </button>
                    ))}
                </div>
            </fieldset>
        </div>
    );
};
