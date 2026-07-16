import {buildRuntimeConfig, stripMeta} from "./util.ts";

let registryCache: any = null;

function getRegistry() {
    if (registryCache) return registryCache;

    const el = document.getElementById('reactedge-registry');
    if (!el) throw new Error('Missing registry');

    registryCache = JSON.parse(el.textContent || '{}');
    return registryCache;
}

const loaded = new Map<string, any>();

async function loadScript(name: string) {
    if (loaded.has(name)) return loaded.get(name);
    const widgetRegistry = getRegistry();
    const entry = widgetRegistry[name]

    await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = entry.src;
        s.type = 'module'
        s.async = true;

        if (entry.integrity) {
            s.integrity = 'sha256-' + entry.integrity;
            s.crossOrigin = 'anonymous';
        }

        s.onload = resolve;
        s.onerror = reject;

        document.head.appendChild(s);
    });

    const mod = (window as any)[`ReactEdge_${name}`]; // or whatever your global export is
    loaded.set(name, mod);

    return mod;
}

function getInstanceKey(el: HTMLElement) {
    const tag = el.tagName.toLowerCase().replace('-widget', '');
    return el.dataset.instance || tag; // your pragmatic fallback
}

function getResolvedEntry(el: HTMLElement) {
    const registry = getRegistry();
    const instanceKey = getInstanceKey(el);

    const tagType = el.tagName.toLowerCase().replace('-widget', '');

    const entry = registry[instanceKey];

    if (!entry) {
        throw new Error(`No config for instance "${instanceKey}"`);
    }

    return {
        type: tagType,
        entry
    };
}

async function resolveGlobal(name: string, retries = 10) {
    const key = `ReactEdge_${name}`;

    for (let i = 0; i < retries; i++) {
        const mod = (window as any)[key];
        if (mod) return mod;
        await new Promise(r => setTimeout(r, 10));
    }

    throw new Error(`Global ${key} not found after load`);
}

function shouldMountWidgets(): boolean {
    const params =
        new URLSearchParams(window.location.search);

    if (params.get('reactedge_mount') === '0') {
        return false;
    }

    return true;
}

export async function mountWidget(el: HTMLElement) {
    const { type, entry } = getResolvedEntry(el);

    await loadScript(type);               // load once per TYPE
    const mod = await resolveGlobal(type);

    if (mod?.mount) {
        const runtimeConfig = buildRuntimeConfig()

        if (!shouldMountWidgets()) {
            console.info('[ReactEdge] CSR mount skipped', {
                widget: entry?.widget,
                instance: entry?.id
            });

            return;
        }

        if (entry?.contract !== null) {
            const contract = entry?.contract ? stripMeta(entry.contract) : null;
            mod.mount(el, contract, runtimeConfig);
        } else {
            mod.mount(el, null, runtimeConfig);
        }
        }
    }
}

function getWidgetType(el: HTMLElement) {
    return el.tagName.toLowerCase().replace('-widget', '');
}

export function scheduleWidgets() {
    const widgets = document.querySelectorAll<HTMLElement>('[data-load]');

    widgets.forEach(el => {
        const name = getWidgetType(el)
        if (!name) return;

        const mode = el.dataset.load || 'lazy';

        if (mode === 'ssr') {
            return;
        }

        if (mode === 'critical') {
            try {
                mountWidget(el);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    console.log(e.message);
                }
            }
            return;
        }

        if (mode === 'eager') {
            onReady(() => {
                try {
                    mountWidget(el);
                } catch (e: unknown) {
                    if (e instanceof Error) {
                        console.log(e.message);
                    }
                }
            });
            return;
        }

        if (mode.startsWith('on-scroll')) {
            scheduleOnScroll(el, mode);
            return;
        }

        // default: lazy (intersection)
        scheduleOnVisible(el);
    });
}

function scheduleOnVisible(el: HTMLElement) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                mountWidget(el);
                observer.unobserve(el);
            }
        });
    }, {
        rootMargin: '200px'
    });

    observer.observe(el);
}

function onReady(cb: () => void) {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        queueMicrotask(cb);
    } else {
        document.addEventListener('DOMContentLoaded', cb);
    }
}

function scheduleOnScroll(el: HTMLElement, mode: string) {
    const match = mode.match(/^on-scroll:(\d+)$/);
    if (!match) return;

    const threshold = Number(match[1]);

    const onScroll = () => {
        if (window.scrollY >= threshold) {
            mountWidget(el);
            window.removeEventListener('scroll', onScroll);
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
}

export function boot() {
    scheduleWidgets();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    queueMicrotask(boot);
}