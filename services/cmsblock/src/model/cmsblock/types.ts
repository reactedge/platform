export type CmsBlockTemplateId = 'editorial' | 'feature' | 'promotion';
export type CmsBlockLayoutId = 'image-above' | 'image-left' | 'image-right';
export type CmsBlockSource = {format: 'text' | 'html'; content: string};
export type CmsBlockImage = {src: string; alt: string};
export type CmsBlockDraft = {
    source: CmsBlockSource;
    templateId: CmsBlockTemplateId;
    layoutId: CmsBlockLayoutId;
    image?: CmsBlockImage;
};
export type CmsBlockRevision = {
    html: string;
    css: string;
    revision: number;
    status: 'inreview' | 'approved';
    // Optional in records persisted before style/layout metadata existed.
    templateId?: CmsBlockTemplateId;
    layoutId?: CmsBlockLayoutId;
};
export type CmsBlockRecord = {
    id: 'demo';
    source: CmsBlockSource;
    templateId: CmsBlockTemplateId;
    layoutId?: CmsBlockLayoutId; // Legacy persisted records have no layoutId.
    image?: CmsBlockImage;
    revision: number;
    pending: CmsBlockRevision | null;
    published: CmsBlockRevision | null;
};
