// Deterministic stand-in for the future AI editor. No user-authored HTML is executed.
// Hard-coded compositions corresponding to the three visual reference images.
// AI image interpretation will replace this mapping in a later iteration.
const templates = {
    editorial: {background: '#F7F4EF', foreground: '#243F3A', accent: '#456A63'},
    feature: {background: '#F1F8F8', foreground: '#234453', accent: '#24717E'},
    promotion: {background: '#1D2C39', foreground: '#FFFFFF', accent: '#F2B65C'},
};

export function validateDraft(value) {
    if (!value || typeof value !== 'object' ||
        !value.source || typeof value.source !== 'object' ||
        !['text', 'html'].includes(value.source.format) ||
        typeof value.source.content !== 'string' ||
        value.source.content.trim().length === 0 ||
        value.source.content.length > 100_000 ||
        !Object.hasOwn(templates, value.templateId)) {
        throw new Error('Provide content (up to 100,000 characters) and a valid template.');
    }
    return {
        source: {format: value.source.format, content: value.source.content},
        templateId: value.templateId,
    };
}

function escapeHtml(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function extractText(source) {
    if (source.format === 'text') return source.content;
    return source.content
        .replace(/<(script|style|iframe|object|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
        .replace(/<\s*br\s*\/?\s*>/gi, '\n')
        .replace(/<\s*\/\s*(p|h[1-6]|li|div|section)\s*>/gi, '\n\n')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&amp;/gi, '&');
}

function extractImages(source) {
    if (source.format !== 'html') return [];
    const tags = source.content.match(/<img\b[^>]*>/gi) ?? [];
    return tags.slice(0, 3).flatMap(tag => {
        const src = tag.match(/\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)')/i)?.slice(1).find(Boolean);
        const alt = tag.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)')/i)?.slice(1).find(v => v !== undefined) ?? '';
        try {
            const url = new URL(src);
            if (url.protocol !== 'https:') return [];
            return [`<img src="${escapeHtml(url.href)}" alt="${escapeHtml(alt)}" loading="lazy">`];
        } catch {
            return [];
        }
    });
}

export function generateBlock(draft) {
    const {source, templateId} = validateDraft(draft);
    const palette = templates[templateId];
    const lines = extractText(source).split(/\n+/).map(x => x.trim()).filter(Boolean);
    const heading = escapeHtml(lines.shift() ?? 'Content block');
    const paragraphs = lines.map(line => `<p>${escapeHtml(line)}</p>`).join('\n');
    const images = extractImages(source);
    const gallery = images.length ? `<figure class="cmsblock-media">${images.join('')}</figure>` : '';
    // The data attribute is the boundary for generated CSS on standard DOM.
    const html = `<section data-cmsblock="demo" class="cmsblock-content cmsblock--${templateId}">
  <div class="cmsblock-copy"><h2>${heading}</h2>${paragraphs}</div>
  ${gallery}
</section>`;
    const css = `[data-cmsblock="demo"] {
  box-sizing: border-box; display: grid; grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem; padding: clamp(1.25rem, 4vw, 3rem); border-radius: 1rem;
  background: ${palette.background}; color: ${palette.foreground}; font-family: system-ui, sans-serif;
  border: 1px solid ${palette.accent}33;
}
[data-cmsblock="demo"] * { box-sizing: border-box; }
[data-cmsblock="demo"] h2 { color: ${palette.accent}; font-size: clamp(1.6rem, 3vw, 2.6rem); margin: 0 0 1rem; line-height: 1.15; }
[data-cmsblock="demo"] p { max-width: 68ch; margin: 0 0 0.85rem; line-height: 1.7; overflow-wrap: anywhere; }
[data-cmsblock="demo"] .cmsblock-media { margin: 0; display: flex; gap: 0.75rem; flex-wrap: wrap; }
[data-cmsblock="demo"] img { display: block; width: 100%; max-width: 100%; height: auto; max-height: 360px; border-radius: 0.75rem; object-fit: cover; }
[data-cmsblock="demo"].cmsblock--editorial .cmsblock-media { grid-row: 1; }
[data-cmsblock="demo"].cmsblock--editorial .cmsblock-copy { grid-row: 2; }
[data-cmsblock="demo"].cmsblock--promotion h2 { font-weight: 800; text-transform: uppercase; }
[data-cmsblock="demo"].cmsblock--promotion p { color: #E2E8F0; }
@media (min-width: 800px) {
  [data-cmsblock="demo"].cmsblock--feature:has(.cmsblock-media),
  [data-cmsblock="demo"].cmsblock--promotion:has(.cmsblock-media) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center;
  }
  [data-cmsblock="demo"].cmsblock--feature .cmsblock-media { grid-column: 1; grid-row: 1; }
  [data-cmsblock="demo"].cmsblock--feature .cmsblock-copy { grid-column: 2; grid-row: 1; }
  [data-cmsblock="demo"].cmsblock--promotion .cmsblock-copy { grid-column: 1; grid-row: 1; }
  [data-cmsblock="demo"].cmsblock--promotion .cmsblock-media { grid-column: 2; grid-row: 1; }
}`;
    return {html, css};
}
