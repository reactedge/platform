import type {CmsBlockRevision} from '../Model/CmsBlockApi.ts';

type Props = {revision: CmsBlockRevision; title: string};

/** Preview is inert: it cannot run JavaScript or navigate the parent page. */
export const CmsBlockRenderedPreview = ({revision, title}: Props) => {
    const document = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${revision.css}</style></head><body style="margin:0">${revision.html}</body></html>`;
    return <iframe
        title={title}
        className="cmsblock-editor__rendered"
        sandbox=""
        referrerPolicy="no-referrer"
        srcDoc={document}
    />;
};
