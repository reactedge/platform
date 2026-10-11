import {CMS_BLOCK_STYLES} from '../Model/CmsBlock.ts';
import type {CmsBlockController} from '../controller/useCmsBlockController.ts';

type Props = {controller: CmsBlockController};

/** Editorial tone is independent of the image placement preview. */
export const CmsBlockStylePicker = ({controller}: Props) => (
    <fieldset className="cmsblock-editor__styles">
        <legend>Editorial style</legend>
        <p>Choose the visual tone of the block. This choice is saved as its template.</p>
        <div className="cmsblock-editor__style-list">
            {CMS_BLOCK_STYLES.map(style => {
                const selected = controller.draft.templateId === style.id;
                return (
                    <button
                        key={style.id}
                        type="button"
                        className={`cmsblock-editor__style cmsblock-editor__style--${style.id}`}
                        data-style-id={style.id}
                        aria-label={`Use ${style.label} style`}
                        aria-pressed={selected}
                        onClick={() => controller.updateTemplate(style.id)}
                    >
                        <span className="cmsblock-editor__style-sample" aria-hidden="true">
                            <span className="cmsblock-editor__style-heading">A heading</span>
                            <span className="cmsblock-editor__style-line"/>
                            <span className="cmsblock-editor__style-line cmsblock-editor__style-line--short"/>
                        </span>
                        <strong>{style.label}</strong>
                        <span className="cmsblock-editor__style-description">{style.description}</span>
                        {selected && <span className="cmsblock-editor__style-selected" aria-hidden="true">✓ Selected</span>}
                    </button>
                );
            })}
        </div>
    </fieldset>
);
