import type {HostConfig, RuntimeConfig} from "./types.ts";
import {parseRuntimeLoadMode} from "./WidgetConfig/runtimeMode.ts";
import {parseHostPlatform} from "./WidgetConfig/hostPlatform.ts";

/**
 * WidgetConfig
 * -------------
 * - One-time configuration snapshot
 * - Reads DOM attributes exactly once
 * - Delegates policy decisions to runtime modules
 * - Immutable after construction
 */
export class WidgetConfig {
    readonly runtime: RuntimeConfig;
    readonly host: HostConfig;

    constructor(el: HTMLElement) {
        this.runtime = Object.freeze(this.readRuntime(el));
        this.host = Object.freeze(this.readHost(el));
        Object.freeze(this);
    }

    // -------------------
    // Shared layers
    // -------------------

    private readRuntime(el: HTMLElement): RuntimeConfig {
        return {
            src: el.dataset.src,
            load: parseRuntimeLoadMode(el.dataset.load),
            page: el.dataset.page ?? "unknown",
        };
    }

    private readHost(el: HTMLElement): HostConfig {
        return {
            name: parseHostPlatform(el.dataset.host),
            widget: el.dataset.widget ?? "unknown",
        };
    }
}
