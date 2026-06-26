// cache/widgetCache.ts
import type { WidgetCacheOptions, CacheRestoreResult } from './types';

const CACHE_PREFIX = 'widget';

function key({ name, version }: WidgetCacheOptions): string {
    return `${CACHE_PREFIX}:${name}:${version}`;
}

function ensureRoot(shadow: ShadowRoot): HTMLElement {
    let root = shadow.querySelector<HTMLElement>('[data-widget-root]');

    if (!root) {
        root = document.createElement('div');
        root.setAttribute('data-widget-root', '');
        shadow.appendChild(root);
    }

    return root;
}

export function restoreCache(
    shadow: ShadowRoot,
    options: WidgetCacheOptions
): CacheRestoreResult {
    const cached = sessionStorage.getItem(key(options));
    if (!cached) return { restored: false };

    const root = ensureRoot(shadow);
    root.innerHTML = cached;

    shadow.host.setAttribute('data-widget-cached', 'true');

    return { restored: true };
}

export function snapshotCache(
    shadow: ShadowRoot,
    options: WidgetCacheOptions
): void {
    const root = shadow.querySelector<HTMLElement>('[data-widget-root]');
    if (!root) {
        console.warn('[widget-cache] no root found, snapshot skipped');
        return;
    }

    sessionStorage.setItem(key(options), root.innerHTML);
    shadow.host.setAttribute('data-widget-cached', 'true');
}

export function clearCache(options: WidgetCacheOptions): void {
    sessionStorage.removeItem(key(options));
}
