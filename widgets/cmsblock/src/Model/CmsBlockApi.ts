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

async function request<T>(path: string, method: 'GET' | 'PUT' | 'POST', body?: CmsBlockDraft | {html: string; css: string; revision: number}): Promise<T | null> {
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
    return data as T;
}

export const CmsBlockApi = {
    get: () => request<CmsBlockRecord>('', 'GET'),
    getPublished: async () => {
        const result = await request<{published: CmsBlockRevision | null}>('/published', 'GET');
        return result?.published ?? null;
    },
    save: (draft: CmsBlockDraft) => request<CmsBlockRecord>('', 'PUT', draft),
    generate: () => request<CmsBlockRecord>('/generate', 'POST'),
    updatePending: (input: {html: string; css: string; revision: number}) => request<CmsBlockRecord>('/pending', 'PUT', input),
    approve: () => request<CmsBlockRecord>('/approve', 'POST'),
    reject: () => request<CmsBlockRecord>('/reject', 'POST'),
};
