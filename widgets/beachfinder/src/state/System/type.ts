import type { BeachFinderApiClient } from "../../services/beachfinder/BeachFinderApi.ts";

export interface SystemState {
    beachFinderApi: BeachFinderApiClient;
}
