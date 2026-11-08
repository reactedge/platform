import type { WidgetConfig } from "../bootstrap/config/Config.ts";
import type { CmsBlockRecord } from "../services/cmsblock/CmsBlockApi.ts";
import { useCmsBlockController } from "../hooks/domain/useCmsBlockController.ts";
import { CmsBlockControllerProvider } from "../state/CmsBlock/CmsBlockControllerContext.tsx";
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
    const cmsBlock = useCmsBlockController(config, bootstrap?.record);
    const { loading, mode } = cmsBlock;

    return (
        <CmsBlockControllerProvider value={cmsBlock}>
            <div className="cmsblock-editor" aria-label="CMS block editor">
                {mode !== "view" && (
                    <header className="cmsblock-editor__header">
                        <h2 data-cmsblock-title style={{ color: config.settings.colour }}>
                            {config.data.title}
                        </h2>
                        <p>Author, generate, review and publish a responsive content block.</p>
                    </header>
                )}
                <CmsBlockModeNavigation />
                <CmsBlockFeedback />
                {!loading && mode === "edit" && <CmsBlockEditMode />}
                {!loading && mode === "review" && <CmsBlockReviewMode />}
                {!loading && mode === "view" && <CmsBlockViewMode />}
            </div>
        </CmsBlockControllerProvider>
    );
};
