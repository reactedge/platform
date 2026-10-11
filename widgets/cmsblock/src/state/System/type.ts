import type { CmsBlockApiClient } from "../../services/cmsblock/CmsBlockApi.ts";

export interface SystemState {
    cmsBlockApi: CmsBlockApiClient;
}
