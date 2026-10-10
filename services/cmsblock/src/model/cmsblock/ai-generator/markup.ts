import type {CmsBlockDraft} from '../types';
import type {SourceStrategy} from '../source-policy';
import {assertSafeMarkup} from '../source-policy';

export function escapeHtml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
export function renderAuthoredHtml(draft: CmsBlockDraft, strategy: 'brief' | 'html-guardrail'): string {
    const text = strategy === 'html-guardrail'
        ? '<div class="cmsblock-copy">' + draft.source.content + '</div>'
        : '<div class="cmsblock-copy cmsblock-literal-text">' +
          escapeHtml(draft.source.content) + '</div>';
    const hasImage = strategy === 'html-guardrail' && /<img\b[^>]*\bsrc\s*=\s*["']https:\/\//i.test(draft.source.content);
    // Images are optional. Neither the generator nor the model may invent them.
    const media = hasImage || !draft.image?.src ? '' : '<figure class="cmsblock-media"><img src="' +
        escapeHtml(draft.image!.src) + '" alt="' + escapeHtml(draft.image!.alt) + '" loading="lazy"></figure>';
    const content = '<section data-cmsblock="demo" class="cmsblock-content cmsblock--' +
        draft.templateId + ' cmsblock-layout--' + draft.layoutId + '">' + text + media + '</section>';
    assertSafeMarkup(content);
    return content;
}
