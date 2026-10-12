import type { CmsBlockRevision } from "../services/cmsblock/CmsBlockApi.ts";
import type { CmsBlockTemplateId } from "../Model/CmsBlock.ts";
import type { CmsBlockLayoutId } from "../Model/CmsBlockLayout.ts";

type Props = {
    revision: CmsBlockRevision;
    templateId: CmsBlockTemplateId;
    layoutId: CmsBlockLayoutId;
};

export function CmsBlockPublishedContent({ revision, templateId, layoutId }: Props) {
    return (
        <article
            className={`cmsblock-published cmsblock-theme--${templateId} cmsblock-layout--${layoutId}`}
            data-cmsblock-published
        >
            <div dangerouslySetInnerHTML={{ __html: revision.html }} />
        </article>
    );
}
