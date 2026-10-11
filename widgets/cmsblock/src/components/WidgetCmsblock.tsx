import type { WidgetConfig } from "../Config.ts";
import type { CmsBlockRecord } from "../services/cmsblock/CmsBlockApi.ts";
import { useCmsBlockController } from "../hooks/domain/useCmsBlockController.ts";
import {
    CmsBlockModeNavigation,
    CmsBlockFeedback,
    CmsBlockEditMode,
    CmsBlockReviewMode,
    CmsBlockViewMode,
} from "./CmsBlockModes.tsx";

type Props = {
    config: WidgetConfig;
    bootstrap?: { record: CmsBlockRecord | null };
};

export const WidgetCmsblock = ({ config, bootstrap }: Props) => {
    const controller = useCmsBlockController(config, bootstrap?.record);
    const { loading, mode } = controller;

    return (
        <section className="cmsblock-editor" aria-label="CMS block editor">
            <header className="cmsblock-editor__header">
                <h1 data-cmsblock-title style={{ color: config.settings.colour }}>
                    {config.data.title}
                </h1>
                <p>Author, generate, review and publish a responsive content block.</p>
            </header>
            <CmsBlockModeNavigation controller={controller} />
            <CmsBlockFeedback controller={controller} />
            {!loading && mode === "edit" && <CmsBlockEditMode controller={controller} />}
            {!loading && mode === "review" && <CmsBlockReviewMode controller={controller} />}
            {!loading && mode === "view" && <CmsBlockViewMode controller={controller} />}
        </section>
    );
};
