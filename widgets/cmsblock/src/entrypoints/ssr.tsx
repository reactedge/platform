import { renderToString } from 'react-dom/server';
import { WIDGET_ID } from '../Config.ts';
import {CmsBlockContent} from '../components/CmsBlockContent.tsx';
import type { CmsBlockBootstrap } from '../ssr/bootstrap.ts';

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isPublishedRevision(value: unknown): value is CmsBlockBootstrap {
    return isRecord(value)
        && typeof value.html === 'string'
        && typeof value.css === 'string'
        && typeof value.revision === 'number'
        && Number.isInteger(value.revision);
}

function resolvePublishedRevision(
    bootstrap: unknown,
    runtime: unknown
): CmsBlockBootstrap | null {
    if (isPublishedRevision(bootstrap)) {
        return bootstrap;
    }

    if (isRecord(runtime) && isPublishedRevision(runtime.cmsblockBootstrap)) {
        return runtime.cmsblockBootstrap;
    }

    return null;
}

/** Signature matches the platform SSR worker: renderHtml(contract, bootstrap, runtime). */
export const renderHtml = (
    _contract: unknown,
    bootstrap: unknown,
    runtime: unknown
): string => {
    const revision = resolvePublishedRevision(bootstrap, runtime);

    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            {revision ? (
                <CmsBlockContent revision={revision} />
            ) : (
                <p role="status">The published CMS block is temporarily unavailable.</p>
            )}
        </div>
    );
};

export {buildBootstrap, loadRuntime} from '../ssr/bootstrap.ts';
