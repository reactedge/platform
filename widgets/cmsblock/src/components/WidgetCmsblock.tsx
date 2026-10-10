import type {WidgetConfig} from '../Config.ts';
import {useCmsBlockController} from '../controller/useCmsBlockController.ts';
import {
    CmsBlockModeNavigation,
    CmsBlockFeedback,
    CmsBlockEditMode,
    CmsBlockReviewMode,
    CmsBlockViewMode,
} from './CmsBlockModes.tsx';

type Props = {config: WidgetConfig; viewOnly?: boolean};

export const WidgetCmsblock = ({config, viewOnly = false}: Props) => {
    const controller = useCmsBlockController(config, {viewOnly});
    const {loading, mode} = controller;

    if (viewOnly) {
        return (
            <section className="cmsblock-editor" aria-label="Published CMS block">
                {loading && <p role="status">Loading published CMS block…</p>}
                {!loading && mode === 'view' && <CmsBlockViewMode controller={controller} />}
            </section>
        );
    }

    return (
        <section className="cmsblock-editor" aria-label="CMS block editor">
            <header className="cmsblock-editor__header">
                <h1 data-cmsblock-title style={{color: config.settings.colour}}>
                    {config.data.title}
                </h1>
                <p>Author, generate, review and publish a responsive content block.</p>
            </header>
            <CmsBlockModeNavigation controller={controller} />
            <CmsBlockFeedback controller={controller} />
            {!loading && mode === 'edit' && <CmsBlockEditMode controller={controller} />}
            {!loading && mode === 'review' && <CmsBlockReviewMode controller={controller} />}
            {!loading && mode === 'view' && <CmsBlockViewMode controller={controller} />}
        </section>
    );
};
