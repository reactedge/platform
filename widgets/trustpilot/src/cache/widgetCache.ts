// cache/widgetCache.ts
import type { WidgetCacheOptions, CacheRestoreResult } from './types';

const CACHE_PREFIX = 'widget';

function key({ name, version }: WidgetCacheOptions): string {
    return `${CACHE_PREFIX}:${name}:${version}`;
}

function ensureRoot(shadow: HTMLElement | ShadowRoot): HTMLElement {
    let root = shadow.querySelector<HTMLElement>('[data-widget-root]');

    if (!root) {
        root = document.createElement('div');
        root.setAttribute('data-widget-root', '');
        shadow.appendChild(root);
    }

    return root;
}

export function restoreCache(
    shadow: HTMLElement | ShadowRoot,
    options: WidgetCacheOptions
): CacheRestoreResult {
    const cached = sessionStorage.getItem(key(options));
    if (!cached) return { restored: false };

    const root = ensureRoot(shadow);
    root.innerHTML = cached;

    if (shadow instanceof ShadowRoot) {
        shadow.host.setAttribute('data-widget-cached', 'true');
    } else {
        shadow.setAttribute('data-widget-cached', 'true');
    }

    return { restored: true };
}

export function snapshotCache(
    shadow: HTMLElement | ShadowRoot,
    options: WidgetCacheOptions
): void {
    const root = shadow.querySelector<HTMLElement>('[data-widget-root]');
    if (!root) {
        console.warn('[widget-cache] no root found, snapshot skipped');
        return;
    }

    sessionStorage.setItem(key(options), root.innerHTML);

    if (shadow instanceof ShadowRoot) {
        shadow.host.setAttribute('data-widget-cached', 'true');
    } else {
        shadow.setAttribute('data-widget-cached', 'true');
    }
}

export function clearCache(options: WidgetCacheOptions): void {
    sessionStorage.removeItem(key(options));
}
