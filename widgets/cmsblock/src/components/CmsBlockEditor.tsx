import {useId} from 'react';
import type {CmsBlockDraft} from '../Model/CmsBlock.ts';
import {CmsBlockStylePicker} from './CmsBlockStylePicker.tsx';
import {CmsBlockLayoutPicker} from './CmsBlockLayoutPicker.tsx';
import type {CmsBlockController} from '../controller/useCmsBlockController.ts';

type Props = {controller: CmsBlockController};

export const CmsBlockEditor = ({controller}: Props) => {
    const contentId = useId();
    const formatId = useId();
    const {draft} = controller;

    return (
        <div className="cmsblock-editor__fields">
            <label htmlFor={contentId}>Source content</label>
            <textarea id={contentId} rows={12} value={draft.source.content}
                onChange={event => controller.updateContent(event.target.value)}
                placeholder="Paste text or HTML here"/>
            <div className="cmsblock-editor__options">
                <div>
                    <label htmlFor={formatId}>Content format</label>
                    <select id={formatId} value={draft.source.format}
                        onChange={event => controller.updateFormat(event.target.value as CmsBlockDraft['source']['format'])}>
                        <option value="text">Plain text</option>
                        <option value="html">HTML source</option>
                    </select>
                </div>
            </div>
            <CmsBlockStylePicker controller={controller}/>
            <CmsBlockLayoutPicker controller={controller}/>
        </div>
    );
};
