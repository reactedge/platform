import type {CmsBlockLayoutId} from '../types';
import type {SourceStrategy} from '../source-policy';

/** Fixed presentation structure: AI is not allowed to reposition or distort media. */
export class CmsBlockLayoutCss {
    build(layout: CmsBlockLayoutId, strategy: SourceStrategy): string {
        const root = '[data-cmsblock="demo"]';
        const cols = layout === 'image-left' || layout === 'image-right';
        const imageFirst = layout === 'image-left' || layout === 'image-above';
        const placement = cols ? `@media (min-width: 800px) {
${root}:has(> .cmsblock-media) { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; }
}` : '';
        return `
${root} { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.5rem; }
${root} > .cmsblock-copy { min-width: 0; grid-row: ${imageFirst ? 2 : 1}; }
${root} > .cmsblock-media { min-width: 0; margin: 0; grid-row: ${imageFirst ? 1 : 2}; }
${root} .cmsblock-media img, ${root} .cmsblock-copy img { display: block; max-width: 100%; width: auto; height: auto; object-fit: contain; }
${root} .cmsblock-copy { font-size: max(1rem, 16px); line-height: 1.5; overflow-wrap: break-word; }
${strategy === 'brief' ? `${root} .cmsblock-literal-text { white-space: pre-wrap; }` : ''}
${placement}
${cols ? `@media (min-width: 800px) {
${root} > .cmsblock-media { grid-row: 1; grid-column: ${imageFirst ? 1 : 2}; }
${root} > .cmsblock-copy { grid-row: 1; grid-column: ${imageFirst ? 2 : 1}; }
}` : ''}
`;
    }
}
