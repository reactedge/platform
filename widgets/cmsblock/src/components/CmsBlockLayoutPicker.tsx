import {CMS_BLOCK_LAYOUTS} from '../Model/CmsBlockLayout.ts';
import {CMS_BLOCK_LAYOUT_IMAGES} from '../Model/CmsBlockLayoutImages.ts';
import type {CmsBlockController} from '../controller/useCmsBlockController.ts';

type Props = {controller: CmsBlockController};

export const CmsBlockLayoutPicker = ({controller}: Props) => {
    const selectedLayout = CMS_BLOCK_LAYOUTS.find(layout => layout.id === controller.draft.layoutId)
        ?? CMS_BLOCK_LAYOUTS[0];

    return (
        <fieldset className="cmsblock-editor__references">
            <legend>Image layout</legend>
            <p>Select where the content image should appear.</p>
            <div className="cmsblock-editor__reference-list">
                {CMS_BLOCK_LAYOUTS.map(layout => {
                    const selected = controller.draft.layoutId === layout.id;
                    return (
                        <button
                            type="button"
                            key={layout.id}
                            className="cmsblock-editor__reference"
                            data-layout-id={layout.id}
                            aria-label={`Use ${layout.label} layout`}
                            aria-pressed={selected}
                            onClick={() => controller.updateLayout(layout.id)}
                        >
                            <span className="cmsblock-editor__reference-image">
                                <img src={CMS_BLOCK_LAYOUT_IMAGES[layout.id]}
                                    alt={`${layout.label} layout illustration`} loading="lazy"/>
                                {selected && <span className="cmsblock-editor__reference-selected"
                                    aria-hidden="true">✓ Selected</span>}
                            </span>
                            <strong>{layout.label}</strong>
                            <span className="cmsblock-editor__reference-description">{layout.description}</span>
                        </button>
                    );
                })}
            </div>
            <div className="cmsblock-editor__reference-detail">
                <img src={CMS_BLOCK_LAYOUT_IMAGES[selectedLayout.id]}
                    alt={`Large preview of ${selectedLayout.label} layout`}/>
                <div className="cmsblock-editor__reference-detail-copy">
                    <p className="cmsblock-editor__reference-eyebrow">Selected image layout</p>
                    <h2 aria-live="polite">{selectedLayout.label}</h2>
                    <p>{selectedLayout.description}</p>
                    <p className="cmsblock-editor__layout-notice">
                        Your layout is saved independently and applied to the next generated revision.
                    </p>
                </div>
            </div>
        </fieldset>
    );
};
