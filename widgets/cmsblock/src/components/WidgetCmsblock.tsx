import type {WidgetConfig} from '../Config.ts';
import {useCmsBlockController} from '../controller/useCmsBlockController.ts';
import {
    CmsBlockModeNavigation,
    CmsBlockFeedback,
    CmsBlockEditMode,
    CmsBlockReviewMode,
    CmsBlockViewMode,
} from './CmsBlockModes.tsx';

type Props = {config: WidgetConfig};

export const WidgetCmsblock = ({config}: Props) => {
    const controller = useCmsBlockController(config);
    const {loading, mode} = controller;
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
