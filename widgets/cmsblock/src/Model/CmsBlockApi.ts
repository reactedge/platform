import type {CmsBlockDraft} from './CmsBlock.ts';

export interface CmsBlockRevision {
    html: string;
    css: string;
    revision: number;
    status: 'inreview' | 'approved';
    layoutId?: CmsBlockDraft['layoutId'];
}

export interface CmsBlockRecord extends CmsBlockDraft {
    id: 'demo';
    revision: number;
    pending: CmsBlockRevision | null;
    published: CmsBlockRevision | null;
}

const base = `${(import.meta.env.VITE_CMSBLOCK_URL || 'http://127.0.0.1:4190').replace(/\/+$/, '')}/cmsblock/blocks/demo`;

async function request(path: string, method: 'GET' | 'PUT' | 'POST', body?: CmsBlockDraft): Promise<CmsBlockRecord | null> {
    let response: Response;
    try {
        response = await fetch(base + path, {
            method,
            headers: {'Content-Type': 'application/json'},
            ...(body ? {body: JSON.stringify(body)} : {}),
            cache: 'no-store',
        });
    } catch {
        throw new Error('Cannot reach the CMSBlock service. Start services/cmsblock on port 4190.');
    }
    if (response.status === 404 && method === 'GET') return null;
    const data: unknown = await response.json();
    if (!response.ok) {
        const error = typeof data === 'object' && data !== null && 'error' in data &&
            typeof data.error === 'string' ? data.error : 'CMSBlock service request failed.';
        throw new Error(error);
    }
    return data as CmsBlockRecord;
}

export const CmsBlockApi = {
    get: () => request('', 'GET'),
    save: (draft: CmsBlockDraft) => request('', 'PUT', draft),
    generate: () => request('/generate', 'POST'),
    approve: () => request('/approve', 'POST'),
    reject: () => request('/reject', 'POST'),
};
