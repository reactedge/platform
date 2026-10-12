import type { CmsBlockRevision } from "../services/cmsblock/CmsBlockApi.ts";
import type { CmsBlockTemplateId } from "../Model/CmsBlock.ts";
import type { CmsBlockLayoutId } from "../Model/CmsBlockLayout.ts";

type Props = {
    revision: CmsBlockRevision;
    title: string;
    templateId?: CmsBlockTemplateId;
    layoutId?: CmsBlockLayoutId;
};

/** The preview is rendered in the widget using its fixed, authored themes. */
export const CmsBlockRenderedPreview = ({
    revision,
    title,
    templateId = "editorial",
    layoutId = "image-above",
}: Props) => (
    <div
        className={`cmsblock-editor__rendered cmsblock-review-preview cmsblock-theme--${templateId} cmsblock-layout--${layoutId}`}
        aria-label={title}
        dangerouslySetInnerHTML={{ __html: revision.html }}
    />
);
