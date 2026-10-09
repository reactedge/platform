/** Source is always preserved as authored; it is not executable markup. */
export type CmsBlockSource = {
    format: 'text' | 'html';
    content: string;
};

export const CMS_BLOCK_TEMPLATES = [
    {id: 'editorial', label: 'Editorial', description: 'Image above the text'},
    {id: 'feature', label: 'Feature', description: 'Image left, text right'},
    {id: 'promotion', label: 'Promotional', description: 'Bold text left, image right'},
] as const;

export type CmsBlockTemplateId = (typeof CMS_BLOCK_TEMPLATES)[number]['id'];

export type CmsBlockDraft = {
    source: CmsBlockSource;
    templateId: CmsBlockTemplateId;
};
