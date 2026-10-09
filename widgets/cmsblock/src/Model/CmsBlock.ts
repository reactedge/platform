/** Source is preserved exactly as authored; editing it does not execute HTML. */
export type CmsBlockSource = {
    format: 'text' | 'html';
    content: string;
};

/**
 * Style is the saved template dimension.
 * The IDs remain unchanged to preserve the current CMSBlock service contract.
 * 'feature' is retained as the API ID for the Minimal style.
 */
export const CMS_BLOCK_STYLES = [
    {id: 'editorial', label: 'Editorial', description: 'Warm, comfortable reading'},
    {id: 'feature', label: 'Minimal', description: 'Clean, understated presentation'},
    {id: 'promotion', label: 'Promotional', description: 'Bold, high-contrast emphasis'},
] as const;

export type CmsBlockTemplateId = (typeof CMS_BLOCK_STYLES)[number]['id'];

export type CmsBlockDraft = {
    source: CmsBlockSource;
    templateId: CmsBlockTemplateId;
};
