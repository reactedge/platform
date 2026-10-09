import {useId} from 'react';
import {CMS_BLOCK_TEMPLATES, type CmsBlockDraft} from '../Model/CmsBlock.ts';
import {CMS_BLOCK_REFERENCE_IMAGES} from '../Model/CmsBlockTemplateImages.ts';
import type {CmsBlockController} from '../controller/useCmsBlockController.ts';

type Props = {controller: CmsBlockController};

export const CmsBlockEditor = ({controller}: Props) => {
    const contentId = useId();
    const formatId = useId();
    const {draft} = controller;
    const selectedTemplate = CMS_BLOCK_TEMPLATES.find(
        template => template.id === draft.templateId
    ) ?? CMS_BLOCK_TEMPLATES[0];

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
                <p>Choose a reference image for the next generated layout.</p>
                <div className="cmsblock-editor__reference-list">
                    {CMS_BLOCK_TEMPLATES.map(template => {
                        const selected = draft.templateId === template.id;

                        return (
                            <button
                                type="button"
                                key={template.id}
                                className="cmsblock-editor__reference"
                                data-template-id={template.id}
                                aria-label={`Use ${template.label} reference`}
                                aria-pressed={selected}
                                onClick={() => controller.updateTemplate(template.id)}
                            >
                                <span className="cmsblock-editor__reference-image">
                                    <img
                                        src={CMS_BLOCK_REFERENCE_IMAGES[template.id]}
                                        alt={`${template.label} layout reference image`}
                                        loading="lazy"
                                    />
                                    {selected && <span
                                        className="cmsblock-editor__reference-selected"
                                        aria-hidden="true"
                                    >✓ Selected</span>}
                                </span>
                                <strong>{template.label}</strong>
                                <span className="cmsblock-editor__reference-description">
                                    {template.description}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="cmsblock-editor__reference-detail">
                    <img
                        src={CMS_BLOCK_REFERENCE_IMAGES[selectedTemplate.id]}
                        alt={`Large preview of ${selectedTemplate.label} visual reference`}
                    />
                    <div className="cmsblock-editor__reference-detail-copy">
                        <p className="cmsblock-editor__reference-eyebrow">Selected reference</p>
                        <h2 aria-live="polite">{selectedTemplate.label}</h2>
                        <p>{selectedTemplate.description}</p>
                        <p>The generated draft will use this reference after you save the selection.</p>
                    </div>
                </div>
            </fieldset>
        </div>
    );
};
