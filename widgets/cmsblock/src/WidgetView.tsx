import type { CmsBlockRecord } from "./services/cmsblock/CmsBlockApi.ts";
import { CmsBlockPublishedContent } from "./components/CmsBlockPublishedContent.tsx";

type Props = {
    contract?: unknown;
    runtime?: unknown;
    bootstrapData?: { record: CmsBlockRecord | null };
};

/** Server rendered view: no editor state, API client, or editor controls. */
export const WidgetView = ({ bootstrapData }: Props) => {
    const record = bootstrapData?.record;
    const published = record?.published;

    if (!record || !published) return null;

    return (
        <CmsBlockPublishedContent
            revision={published}
            templateId={record.templateId}
            layoutId={published.layoutId ?? record.layoutId ?? "image-above"}
        />
    );
};
