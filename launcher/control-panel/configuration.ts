import { chmodSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const defaults = {
    storeCode: 'default',
    siteUrl: 'https://mageos-docker.magsite.co.uk',
    targetRoot: '/var/www/docker_mageos/magento',
    phpEnv: true,
    hasCatalog: true,
    observabilityEnabled: false,
    otelHost: 'https://otel.reactedge.net/v1/traces',
    intentDiscoveryEnabled: false,
    sellerListingEnabled: false,
    defaultSellerId: 'default-seller',
    turnstileEnabled: false,
    turnstileSiteKey: '',
    googleMapsEnabled: false,
    googleReviewsEnabled: false,
    googleMapsApiKey: '',
    googlePlaceId: '',
    sku: 'WJ12',
    category: 'tops-men',
    ssrEnabled: true,
    ssrPort: '4000',
    ssrBaseUrl: 'https://widgets-ssr.co.uk',
    environment: 'development',
    additionalHosts: '',
};

export type Configuration = typeof defaults;

function siteHostname(url: string): string {
    try { return new URL(url).hostname.toLowerCase(); }
    catch { return ''; }
}

export function allowedHostDetails(config: Configuration) {
    const entries = [
        { host: siteHostname(config.siteUrl), reason: 'Site URL (always allowed)' },
        ...(config.environment === 'development' ? [
            { host: 'localhost', reason: 'Local development' },
            { host: '127.0.0.1', reason: 'Local development' },
        ] : []),
        ...config.additionalHosts.split(',').map(host => ({ host: host.trim().toLowerCase(), reason: 'Additional contract URL' })),
    ];
    return entries.filter((entry, index) => entry.host && entries.findIndex(other => other.host === entry.host) === index);
}

function parseEnv(file: string): Record<string, string> {
    if (!existsSync(file)) return {};
    const result: Record<string, string> = {};
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
        const match = /^([A-Z][A-Z0-9_]*)=(.*)$/.exec(line);
        if (!match) continue;
        const value = match[2];
        result[match[1]] = value.length >= 2 && ((value[0] === "'" && value.at(-1) === "'") || (value[0] === '"' && value.at(-1) === '"'))
            ? value.slice(1, -1)
            : value;
    }
    return result;
}

export function readConfiguration(root: string, storeCode: string, includeStoreEnv = true): Configuration {
    if (!/^[a-zA-Z0-9_-]+$/.test(storeCode)) throw new Error('Store code may contain letters, numbers, underscores and hyphens only.');
    const sample = parseEnv(join(root, '.env.sample'));
    const env = { ...sample, ...(includeStoreEnv ? parseEnv(join(root, `.env.${storeCode}`)) : {}) };
    const enabled = (key: string, fallback: boolean) => env[key] === undefined ? fallback : env[key] === '1';
    const automaticallyAllowed = new Set([
        siteHostname(env.SITEURL || defaults.siteUrl), siteHostname(sample.SITEURL || defaults.siteUrl),
        'localhost', '127.0.0.1',
    ]);
    return {
        ...defaults,
        storeCode,
        siteUrl: env.SITEURL || defaults.siteUrl,
        targetRoot: env.TARGET_ROOT || defaults.targetRoot,
        phpEnv: enabled('PHP_ENV', true),
        hasCatalog: enabled('CATALOG_ENABLED', true),
        observabilityEnabled: enabled('OBSERVABILITY_ENABLED', Boolean(env.OTEL_HOST)),
        otelHost: env.OTEL_HOST || defaults.otelHost,
        intentDiscoveryEnabled: enabled('INTENT_DISCOVERY_ENABLED', false),
        sellerListingEnabled: enabled('SELLER_LISTING_ENABLED', false),
        defaultSellerId: env.DEFAULT_SELLER_ID || defaults.defaultSellerId,
        turnstileEnabled: enabled('CLOUDFLARE_TURNSTILE_ENABLED', false),
        turnstileSiteKey: env.CLOUDFLARE_TURNSTILE_SITE_KEY || '',
        googleMapsEnabled: enabled('GOOGLE_MAPS_ENABLED', Boolean(env.GOOGLE_MAPS_API_KEY) && !enabled('GOOGLE_REVIEWS_ENABLED', false)),
        googleReviewsEnabled: enabled('GOOGLE_REVIEWS_ENABLED', false),
        googleMapsApiKey: env.GOOGLE_MAPS_API_KEY || '',
        googlePlaceId: env.GOOGLE_PLACE_ID || '',
        sku: env.SKU || defaults.sku,
        category: env.CATEGORY || defaults.category,
        ssrEnabled: enabled('SSR_ENABLED', true),
        ssrPort: env.SSR_PORT ?? defaults.ssrPort,
        ssrBaseUrl: env.SSR_BASE_URL ?? defaults.ssrBaseUrl,
        environment: env.REACTEDGE_ENV || defaults.environment,
        additionalHosts: (env.ALLOWED_HOSTS || '').split(',').map(host => host.trim())
            .filter(host => host && !automaticallyAllowed.has(host.toLowerCase())).join(', '),
    };
}

export function readConfigurationTemplate(root: string): Configuration {
    return { ...readConfiguration(root, 'default', false), storeCode: '' };
}

export function listEnvironments(root: string) {
    return readdirSync(root, { withFileTypes: true })
        .filter(entry => entry.isFile() && /^\.env\.[a-zA-Z0-9_-]+$/.test(entry.name) && entry.name !== '.env.sample')
        .map(entry => {
            const storeCode = entry.name.slice('.env.'.length);
            return { storeCode, siteUrl: readConfiguration(root, storeCode).siteUrl };
        })
        .sort((a, b) => a.storeCode.localeCompare(b.storeCode));
}

export function retainAdvancedSsrSettings(root: string, input: unknown): unknown {
    if (!input || typeof input !== 'object' || Array.isArray(input)) return input;
    const submitted = input as Record<string, unknown>;
    const stored = readConfiguration(root, String(submitted.storeCode ?? ''));
    return { ...submitted, ssrPort: stored.ssrPort, ssrBaseUrl: stored.ssrBaseUrl };
}

export function validateConfiguration(input: unknown): Configuration {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected a configuration object.');
    const source = input as Record<string, unknown>;
    for (const key of Object.keys(defaults)) {
        const value = source[key];
        if (typeof value !== typeof defaults[key as keyof Configuration]) throw new Error(`Invalid ${key}.`);
        if (typeof value === 'string' && /[\r\n\0']/.test(value)) {
            throw new Error(`${key} cannot contain a newline or apostrophe (environment files are shell sourced).`);
        }
    }
    const config = source as Configuration;
    if (!/^[a-zA-Z0-9_-]+$/.test(config.storeCode)) throw new Error('Store code may contain letters, numbers, underscores and hyphens only.');
    if (config.hasCatalog && (!config.sku || !config.category)) throw new Error('Demo SKU and category are required when the site has a catalog.');
    if (!isAbsolute(config.targetRoot)) throw new Error('Platform root must be an absolute path.');
    if (!['development', 'production'].includes(config.environment)) throw new Error('Environment must be development or production.');
    for (const host of config.additionalHosts.split(',').map(value => value.trim()).filter(Boolean)) {
        if (!/^[a-zA-Z0-9.-]+$/.test(host) || host.startsWith('.') || host.endsWith('.') || host.includes('..')) {
            throw new Error(`Additional host "${host}" must be a hostname without a scheme, port or path.`);
        }
    }
    for (const [name, value] of [['Site URL', config.siteUrl], ['OpenTelemetry URL', config.otelHost]]) {
        if (name === 'OpenTelemetry URL' && !config.observabilityEnabled) continue;
        try {
            const url = new URL(value);
            if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) throw new Error();
        } catch { throw new Error(`${name} must be an http(s) URL.`); }
    }
    if (config.sellerListingEnabled && !config.defaultSellerId.trim()) {
        throw new Error('Default Seller ID is required when Seller Listing is enabled.');
    }
    if (config.turnstileEnabled && !config.turnstileSiteKey) throw new Error('Turnstile site key is required when enabled.');
    if ((config.googleMapsEnabled || config.googleReviewsEnabled) && !config.googleMapsApiKey) {
        throw new Error('Google Maps API key is required for maps or reviews.');
    }
    if (config.googleReviewsEnabled && !config.googlePlaceId) throw new Error('Google Place ID is required when reviews are enabled.');
    return config;
}

function envFile(values: Record<string, string>): string {
    return Object.entries(values).map(([key, value]) => `${key}='${value}'`).join('\n') + '\n';
}

export function planConfiguration(root: string, input: unknown) {
    const c = validateConfiguration(input);
    const workspaceRoot = join(root, 'workspace');
    const storePath = join(workspaceRoot, c.storeCode);
    const samplePath = join(root, 'workspace.sample');
    if (!existsSync(join(samplePath, 'default')) && !existsSync(storePath)) throw new Error('Missing workspace.sample/default.');
    if (!existsSync(join(samplePath, 'registry.json')) && !existsSync(join(workspaceRoot, 'registry.json'))) {
        throw new Error('Missing workspace.sample/registry.json.');
    }
    const siteUrl = c.siteUrl.replace(/\/+$/, '');
    const allowedHosts = allowedHostDetails(c).map(entry => entry.host).join(',');
    const integrations: Record<string, object> = { magentoGraphql: { api: `${siteUrl}/graphql` } };
    if (c.intentDiscoveryEnabled) integrations.intentApi = { baseUrl: 'http://localhost:3001' };
    if (c.googleMapsEnabled || c.googleReviewsEnabled) {
        integrations.googleMaps = {
            apiKey: c.googleMapsApiKey,
            ...(c.googleReviewsEnabled ? { placeId: c.googlePlaceId } : {}),
        };
    }
    if (c.turnstileEnabled) integrations.cloudflare = { siteKey: c.turnstileSiteKey };
    const baseContext = { storeCode: c.storeCode, ...(c.hasCatalog ? { sku: c.sku, category: c.category } : {}) };
    const runtimeFor = (widgetName: string) => JSON.stringify({
        integrations,
        context: {
            ...baseContext,
            ...(c.sellerListingEnabled && widgetName === 'createlisting'
                ? { sellerId: c.defaultSellerId }
                : {}),
        },
    }, null, 2) + '\n';
    const bool = (value: boolean) => value ? '1' : '0';
    const files = new Map<string, string>();
    files.set(join(root, `.env.${c.storeCode}`), envFile({
        STORE_CODE: c.storeCode, SITEURL: siteUrl, PHP_ENV: bool(c.phpEnv), TARGET_ROOT: c.targetRoot,
        CATALOG_ENABLED: bool(c.hasCatalog),
        SSR_ENABLED: bool(c.ssrEnabled), SSR_PORT: c.ssrPort, SSR_BASE_URL: c.ssrBaseUrl,
        ...(c.hasCatalog ? { SKU: c.sku, CATEGORY: c.category } : {}),
        OBSERVABILITY_ENABLED: bool(c.observabilityEnabled),
        INTENT_DISCOVERY_ENABLED: bool(c.intentDiscoveryEnabled),
        SELLER_LISTING_ENABLED: bool(c.sellerListingEnabled),
        DEFAULT_SELLER_ID: c.sellerListingEnabled ? c.defaultSellerId : '',
        CLOUDFLARE_TURNSTILE_ENABLED: bool(c.turnstileEnabled),
        CLOUDFLARE_TURNSTILE_SITE_KEY: c.turnstileEnabled ? c.turnstileSiteKey : '',
        GOOGLE_MAPS_ENABLED: bool(c.googleMapsEnabled), GOOGLE_REVIEWS_ENABLED: bool(c.googleReviewsEnabled),
        GOOGLE_MAPS_API_KEY: c.googleMapsEnabled || c.googleReviewsEnabled ? c.googleMapsApiKey : '',
        GOOGLE_PLACE_ID: c.googleReviewsEnabled ? c.googlePlaceId : '',
        REACTEDGE_ENV: c.environment, OTEL_HOST: c.observabilityEnabled ? c.otelHost : '', ALLOWED_HOSTS: allowedHosts,
    }));
    files.set(join(root, 'services/ssr/.env'), envFile({
        SSR_PORT: c.ssrPort, ALLOW_SELF_SIGNED_SSL: c.environment === 'development' ? 'true' : 'false',
        OTEL_HOST: c.observabilityEnabled ? c.otelHost : '',
    }));
    files.set(join(root, `services/orchestrator/.env.${c.storeCode}`), envFile({
        STORE_CODE: c.storeCode, SITEURL: siteUrl, TARGET_ROOT: c.targetRoot, SSR_ENABLED: bool(c.ssrEnabled),
        PHP_ENV: bool(c.phpEnv), ALLOWED_HOSTS: allowedHosts,
    }));
    files.set(join(root, `mcp/.env.${c.storeCode}`), envFile({
        STORE_CODE: c.storeCode,
        SITEURL: siteUrl,
        PHP_ENV: bool(c.phpEnv),
        ALLOWED_HOSTS: allowedHosts,
        CLOUDFLARE_TURNSTILE_SITE_KEY: c.turnstileEnabled ? c.turnstileSiteKey : '',
        GOOGLE_MAPS_API_KEY: c.googleMapsEnabled || c.googleReviewsEnabled ? c.googleMapsApiKey : '',
        GOOGLE_PLACE_ID: c.googleReviewsEnabled ? c.googlePlaceId : '',
    }));
    files.set(join(root, `browser-mcp/.env.${c.storeCode}`), envFile({ SITEURL: siteUrl }));
    for (const parent of ['widgets', 'packages/widget-template']) {
        const dir = join(root, parent);
        if (!existsSync(dir)) continue;
        for (const entry of readdirSync(dir, { withFileTypes: true }).filter(entry => entry.isDirectory())) {
            const publicPath = join(dir, entry.name, 'public');
            if (existsSync(publicPath)) {
                files.set(join(publicPath, 'reactedge-runtime.json'), runtimeFor(entry.name));
            }
        }
    }
    return { config: c, files, workspaceRoot, storePath, samplePath, targetWorkspace: join(dirname(c.targetRoot), 'reactedge') };
}

export function previewConfiguration(root: string, input: unknown) {
    const plan = planConfiguration(root, input);
    const changed = [...plan.files].filter(([path, content]) => !existsSync(path) || readFileSync(path, 'utf8') !== content)
        .map(([path]) => path.slice(root.length + 1));
    const workspaceSetup = [
        ...(!existsSync(plan.storePath) ? [`workspace/${plan.config.storeCode}/ from workspace.sample/default/`] : []),
        ...(!existsSync(join(plan.workspaceRoot, 'registry.json')) ? ['workspace/registry.json from workspace.sample/'] : []),
        ...(!existsSync(join(plan.workspaceRoot, 'release')) && existsSync(join(plan.samplePath, 'release'))
            ? ['workspace/release/ from workspace.sample/release/'] : []),
    ];
    return {
        changed,
        workspaceSetup,
        allowedHosts: allowedHostDetails(plan.config),
        workspace: existsSync(plan.storePath) ? 'existing' : 'create from sample',
        targetWorkspace: plan.targetWorkspace,
        note: [
            'Runtime JSON and services/ssr/.env are shared across stores; saving another store replaces them.',
            ...(!plan.config.hasCatalog ? ['Catalog widgets still require SKU and catalog services. Disable them in the registry before building.'] : []),
        ].join('\n'),
    };
}

export function applyConfiguration(root: string, input: unknown) {
    const plan = planConfiguration(root, input);
    const preview = previewConfiguration(root, input);
    // Check the external target before writing configuration files.
    mkdirSync(plan.targetWorkspace, { recursive: true });
    const probe = join(plan.targetWorkspace, `.reactedge-write-test-${process.pid}`);
    writeFileSync(probe, '');
    rmSync(probe);
    mkdirSync(plan.workspaceRoot, { recursive: true });
    if (!existsSync(plan.storePath)) cpSync(join(plan.samplePath, 'default'), plan.storePath, { recursive: true });
    if (!existsSync(join(plan.workspaceRoot, 'registry.json'))) {
        cpSync(join(plan.samplePath, 'registry.json'), join(plan.workspaceRoot, 'registry.json'));
    }
    if (!existsSync(join(plan.workspaceRoot, 'release')) && existsSync(join(plan.samplePath, 'release'))) {
        cpSync(join(plan.samplePath, 'release'), join(plan.workspaceRoot, 'release'), { recursive: true });
    }
    for (const [path, content] of plan.files) {
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, content, { mode: path.endsWith('.json') ? 0o644 : 0o600 });
        if (!path.endsWith('.json')) chmodSync(path, 0o600);
    }
    return preview;
}