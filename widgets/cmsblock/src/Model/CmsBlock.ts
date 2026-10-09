/** Source is always preserved as authored; it is not executable markup. */
export type CmsBlockSource = {
    format: 'text' | 'html';
    content: string;
};

export const CMS_BLOCK_TEMPLATES = [
    {id: 'editorial', label: 'Editorial'},
    {id: 'feature', label: 'Feature'},
    {id: 'promotion', label: 'Promotional'},
] as const;

export type CmsBlockTemplateId = (typeof CMS_BLOCK_TEMPLATES)[number]['id'];

export type CmsBlockDraft = {
    source: CmsBlockSource;
    templateId: CmsBlockTemplateId;
};
