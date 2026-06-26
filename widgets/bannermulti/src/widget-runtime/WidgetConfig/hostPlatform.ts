// widget-runtime/config/hostPlatform.ts

import type { HostPlatform } from "../types";

export function parseHostPlatform(value?: string): HostPlatform {
    switch (value) {
        case "magento":
        case "wordpress":
        case "static":
            return value;
        default:
            return "unknown";
    }
}
