export interface CmsBlockBootstrap {
    html: string;
    css: string;
    revision: number;
}

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

/**
 * Loads the currently published CMSBlock revision for server rendering.
 * The CMSBlock service remains private; configure its server-side URL with
 * CMSBLOCK_SERVICE_URL when it is not available on localhost:4190.
 */
export async function buildBootstrap(
    _runtimeConfig?: unknown
): Promise<CmsBlockBootstrap | null> {
    const serviceUrl = (
        process.env.CMSBLOCK_SERVICE_URL ?? 'http://127.0.0.1:4190'
    ).replace(/\/+$/, '');

    const response = await fetch(
        `${serviceUrl}/cmsblock/blocks/demo`,
        {cache: 'no-store'}
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            `CMSBlock service request failed with status ${response.status}.`
        );
    }

    const record: unknown = await response.json();
    if (!isRecord(record) || !('published' in record)) {
        throw new Error('CMSBlock service returned an invalid record.');
    }

    if (record.published === null) {
        return null;
    }

    if (!isPublishedRevision(record.published)) {
        throw new Error(
            'CMSBlock service returned an invalid published revision.'
        );
    }

    return {
        html: record.published.html,
        css: record.published.css,
        revision: record.published.revision,
    };
}
