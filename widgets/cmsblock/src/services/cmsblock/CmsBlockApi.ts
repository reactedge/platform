import type { CmsBlockDraft } from "../../Model/CmsBlock.ts";

export interface CmsBlockRevision {
    html: string;
    css: string;
    revision: number;
    status: "inreview" | "approved";
    layoutId?: CmsBlockDraft["layoutId"];
}

export interface CmsBlockRecord extends CmsBlockDraft {
    id: "demo";
    revision: number;
    pending: CmsBlockRevision | null;
    published: CmsBlockRevision | null;
}

export interface CmsBlockBootstrap {
    record: CmsBlockRecord | null;
}

export interface CmsBlockPendingUpdate {
    html: string;
    css: string;
    revision: number;
}

export interface CmsBlockApiClient {
    get(): Promise<CmsBlockRecord | null>;
    save(draft: CmsBlockDraft): Promise<CmsBlockRecord | null>;
    generate(): Promise<CmsBlockRecord | null>;
    updatePending(input: CmsBlockPendingUpdate): Promise<CmsBlockRecord | null>;
    approve(): Promise<CmsBlockRecord | null>;
    reject(): Promise<CmsBlockRecord | null>;
}

export function createCmsBlockApiClient(apiUrl: string): CmsBlockApiClient {
    const base = apiUrl.replace(/\/+$/, "") + "/cmsblock/blocks/demo";

    async function request(
        path: string,
        method: "GET" | "PUT" | "POST",
        body?: CmsBlockDraft | CmsBlockPendingUpdate
    ): Promise<CmsBlockRecord | null> {
        let response: Response;
        try {
            response = await fetch(base + path, {
                method,
                headers: { "Content-Type": "application/json" },
                ...(body ? { body: JSON.stringify(body) } : {}),
                cache: "no-store",
            });
        } catch (error) {
            const cause = error instanceof Error
                ? `${error.name}: ${error.message}`
                : String(error);
            throw new Error(
                `Cannot reach the CMSBlock service at '${base + path}': ${cause}`,
                { cause: error }
            );
        }

        if (response.status === 404 && method === "GET") return null;

        let data: unknown;
        try {
            data = await response.json();
        } catch {
            throw new Error("CMSBlock service returned an invalid JSON response.");
        }

        if (!response.ok) {
            const message =
                typeof data === "object" &&
                data !== null &&
                "error" in data &&
                typeof data.error === "string"
                    ? data.error
                    : "CMSBlock service request failed.";
            throw new Error(message);
        }

        return data as CmsBlockRecord;
    }

    return {
        get: () => request("", "GET"),
        save: (draft) => request("", "PUT", draft),
        generate: () => request("/generate", "POST"),
        updatePending: (input) => request("/pending", "PUT", input),
        approve: () => request("/approve", "POST"),
        reject: () => request("/reject", "POST"),
    };
}

export function isCmsBlockBootstrap(value: unknown): value is CmsBlockBootstrap {
    if (typeof value !== "object" || value === null || !("record" in value)) return false;
    const record = value.record;
    return record === null || (typeof record === "object" && record !== null);
}
