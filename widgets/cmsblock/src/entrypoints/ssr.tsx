import { renderToString } from 'react-dom/server';
import { WIDGET_ID } from '../Config.ts';
import type { CmsBlockBootstrap } from '../ssr/bootstrap.ts';

function buildDocument(revision: CmsBlockBootstrap): string {
    return `<!doctype html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>${revision.css}</style>
</head>
<body style="margin:0">${revision.html}</body>
</html>`;
}

export const renderHtml = (
    _contract: unknown,
    _runtimeConfig: unknown,
    bootstrap: CmsBlockBootstrap | null
): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            {bootstrap ? (
                <iframe
                    title={`Published CMSBlock revision ${bootstrap.revision}`}
                    className="cmsblock-editor__rendered"
                    style={{width: '100%', minHeight: '28rem', border: 0}}
                    sandbox=""
                    referrerPolicy="no-referrer"
                    srcDoc={buildDocument(bootstrap)}
                />
            ) : (
                <p role="status">The published CMS block is temporarily unavailable.</p>
            )}
        </div>
    );
};

export { buildBootstrap } from '../ssr/bootstrap.ts';
