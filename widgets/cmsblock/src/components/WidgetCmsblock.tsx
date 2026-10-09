import type {WidgetConfig} from '../Config.ts';
import {CmsBlockEditor} from './CmsBlockEditor.tsx';
import {CmsBlockSourcePreview} from './CmsBlockSourcePreview.tsx';
import {useCmsBlockController} from '../controller/useCmsBlockController.ts';

type Props = {config: WidgetConfig};

export const WidgetCmsblock = ({config}: Props) => {
    const controller = useCmsBlockController(config);

    return (
        <section className="cmsblock-editor" aria-label="CMS block editor">
            <header className="cmsblock-editor__header">
                <h1 data-cmsblock-title style={{color: config.settings.colour}}>
                    {config.data.title}
                </h1>
                <p>Prepare source content and associate it with a presentation template.</p>
            </header>

            <CmsBlockEditor controller={controller} />
            <div className="cmsblock-editor__actions">
                <button
                    type="button"
                    onClick={() => controller.setShowSourcePreview(!controller.showSourcePreview)}
                    aria-pressed={controller.showSourcePreview}
                >
                    {controller.showSourcePreview ? 'Hide source preview' : 'Inspect source'}
                </button>
                <button type="button" disabled={!controller.changed} onClick={controller.reset}>
                    Reset changes
                </button>
                <span role="status">
                    {controller.changed ? 'Unsaved working copy' : 'No unsaved changes'}
                </span>
            </div>

            {controller.showSourcePreview && <CmsBlockSourcePreview draft={controller.draft} />}

            <p className="cmsblock-editor__note">
                Draft persistence, AI generation and approval will be added in separate steps.
            </p>
        </section>
    );
};
