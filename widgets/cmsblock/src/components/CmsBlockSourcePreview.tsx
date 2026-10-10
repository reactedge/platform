import type {CmsBlockDraft} from '../Model/CmsBlock.ts';

type Props = {draft: CmsBlockDraft};

export const CmsBlockSourcePreview = ({draft}: Props) => (
    <div className="cmsblock-editor__preview" aria-label="Source preview">
        <h2>Source preview</h2>
        <p>Showing the source safely. HTML is not executed or styled until the generation and review service is added.</p>
        <pre><code>{draft.source.content || 'No content entered yet.'}</code></pre>
    </div>
);
