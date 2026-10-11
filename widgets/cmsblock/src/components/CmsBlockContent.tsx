import type {CmsBlockRevision} from '../Model/CmsBlockApi.ts';

type Props = {
    revision: Pick<CmsBlockRevision, 'html' | 'css' | 'revision'>;
};

/** Renders an approved revision inline with its CMSBlock-scoped stylesheet. */
export const CmsBlockContent = ({revision}: Props) => (
    <div className="cmsblock-published" data-cmsblock-revision={revision.revision}>
        <style>{revision.css}</style>
        <div dangerouslySetInnerHTML={{__html: revision.html}} />
    </div>
);
