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

function validatePropertyValues(source: Record<string, unknown>): void {
    for (const key of Object.keys(defaults)) {
        const value = source[key];
        if (typeof value !== typeof defaults[key as keyof Configuration]) throw new Error(`Invalid ${key}.`);
        if (typeof value === 'string' && /[\r\n\0']/.test(value)) {
            throw new Error(`${key} cannot contain a newline or apostrophe (environment files are shell sourced).`);
        }
    }
}

function validateStoreSettings(config: Configuration): void {
    if (!/^[a-zA-Z0-9_-]+$/.test(config.storeCode)) throw new Error('Store code may contain letters, numbers, underscores and hyphens only.');
    if (config.hasCatalog && (!config.sku || !config.category)) throw new Error('Demo SKU and category are required when the site has a catalog.');
    if (!isAbsolute(config.targetRoot)) throw new Error('Platform root must be an absolute path.');
    if (!['development', 'production'].includes(config.environment)) throw new Error('Environment must be development or production.');
}

function validateAdditionalHosts(value: string): void {
    for (const host of value.split(',').map(item => item.trim()).filter(Boolean)) {
        if (!/^[a-zA-Z0-9.-]+$/.test(host) || host.startsWith('.') || host.endsWith('.') || host.includes('..')) {
            throw new Error(`Additional host "${host}" must be a hostname without a scheme, port or path.`);
        }
    }
}

function validateHttpUrls(config: Configuration): void {
    const urls = [['Site URL', config.siteUrl], ['OpenTelemetry URL', config.otelHost]];
    for (const [name, value] of urls) {
        if (name === 'OpenTelemetry URL' && !config.observabilityEnabled) continue;
        try {
            const url = new URL(value);
            if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) throw new Error();
        } catch { throw new Error(`${name} must be an http(s) URL.`); }
    }
}

function validateIntegrationSettings(config: Configuration): void {
    if (config.sellerListingEnabled && !config.defaultSellerId.trim()) {
        throw new Error('Default Seller ID is required when Seller Listing is enabled.');
    }
    if (config.turnstileEnabled && !config.turnstileSiteKey) throw new Error('Turnstile site key is required when enabled.');
    if ((config.googleMapsEnabled || config.googleReviewsEnabled) && !config.googleMapsApiKey) {
        throw new Error('Google Maps API key is required for maps or reviews.');
    }
    if (config.googleReviewsEnabled && !config.googlePlaceId) throw new Error('Google Place ID is required when reviews are enabled.');
}

export function validateConfiguration(input: unknown): Configuration {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected a configuration object.');
    const source = input as Record<string, unknown>;
    validatePropertyValues(source);
    const config = source as Configuration;
    validateStoreSettings(config);
    validateAdditionalHosts(config.additionalHosts);
    validateHttpUrls(config);
    validateIntegrationSettings(config);
    return config;
}

function envFile(values: Record<string, string>): string {
    return Object.entries(values).map(([key, value]) => `${key}='${value}'`).join('\n') + '\n';
}

function validateWorkspace(workspaceRoot: string, storePath: string, samplePath: string): void {
    if (!existsSync(join(samplePath, 'default')) && !existsSync(storePath)) throw new Error('Missing workspace.sample/default.');
    if (!existsSync(join(samplePath, 'registry.json')) && !existsSync(join(workspaceRoot, 'registry.json'))) {
        throw new Error('Missing workspace.sample/registry.json.');
    }
}

function buildIntegrations(config: Configuration, siteUrl: string): Record<string, object> {
    const integrations: Record<string, object> = {magentoGraphql: {api: `${siteUrl}/graphql`}};
    if (config.intentDiscoveryEnabled) integrations.intentApi = {baseUrl: 'http://localhost:3001'};
    if (config.googleMapsEnabled || config.googleReviewsEnabled) {
        integrations.googleMaps = {
            apiKey: config.googleMapsApiKey,
            ...(config.googleReviewsEnabled ? {placeId: config.googlePlaceId} : {}),
        };
    }
    if (config.turnstileEnabled) integrations.cloudflare = {siteKey: config.turnstileSiteKey};
    return integrations;
}

function runtimeJson(config: Configuration, integrations: Record<string, object>, widgetName: string): string {
    const baseContext = {storeCode: config.storeCode, ...(config.hasCatalog ? {sku: config.sku, category: config.category} : {})};
    const seller = config.sellerListingEnabled && widgetName === 'createlisting'
        ? {sellerId: config.defaultSellerId}
        : {};
    return JSON.stringify({integrations, context: {...baseContext, ...seller}}, null, 2) + '\n';
}

function storeEnvironment(config: Configuration, siteUrl: string, allowedHosts: string): Record<string, string> {
    const bool = (value: boolean) => value ? '1' : '0';
    return {
        STORE_CODE: config.storeCode, SITEURL: siteUrl, PHP_ENV: bool(config.phpEnv), TARGET_ROOT: config.targetRoot,
        CATALOG_ENABLED: bool(config.hasCatalog),
        SSR_ENABLED: bool(config.ssrEnabled), SSR_PORT: config.ssrPort, SSR_BASE_URL: config.ssrBaseUrl,
        ...(config.hasCatalog ? {SKU: config.sku, CATEGORY: config.category} : {}),
        OBSERVABILITY_ENABLED: bool(config.observabilityEnabled),
        INTENT_DISCOVERY_ENABLED: bool(config.intentDiscoveryEnabled),
        SELLER_LISTING_ENABLED: bool(config.sellerListingEnabled),
        DEFAULT_SELLER_ID: config.sellerListingEnabled ? config.defaultSellerId : '',
        CLOUDFLARE_TURNSTILE_ENABLED: bool(config.turnstileEnabled),
        CLOUDFLARE_TURNSTILE_SITE_KEY: config.turnstileEnabled ? config.turnstileSiteKey : '',
        GOOGLE_MAPS_ENABLED: bool(config.googleMapsEnabled), GOOGLE_REVIEWS_ENABLED: bool(config.googleReviewsEnabled),
        GOOGLE_MAPS_API_KEY: config.googleMapsEnabled || config.googleReviewsEnabled ? config.googleMapsApiKey : '',
        GOOGLE_PLACE_ID: config.googleReviewsEnabled ? config.googlePlaceId : '',
        REACTEDGE_ENV: config.environment, OTEL_HOST: config.observabilityEnabled ? config.otelHost : '', ALLOWED_HOSTS: allowedHosts,
    };
}

function serviceEnvironment(config: Configuration): Record<string, string> {
    return {
        SSR_PORT: config.ssrPort,
        ALLOW_SELF_SIGNED_SSL: config.environment === 'development' ? 'true' : 'false',
        OTEL_HOST: config.observabilityEnabled ? config.otelHost : '',
    };
}

function orchestratorEnvironment(config: Configuration, siteUrl: string, allowedHosts: string): Record<string, string> {
    const bool = (value: boolean) => value ? '1' : '0';
    return {
        STORE_CODE: config.storeCode, SITEURL: siteUrl, TARGET_ROOT: config.targetRoot,
        SSR_ENABLED: bool(config.ssrEnabled), PHP_ENV: bool(config.phpEnv), ALLOWED_HOSTS: allowedHosts,
    };
}

function mcpEnvironment(config: Configuration, siteUrl: string, allowedHosts: string): Record<string, string> {
    return {
        STORE_CODE: config.storeCode, SITEURL: siteUrl, PHP_ENV: config.phpEnv ? '1' : '0', ALLOWED_HOSTS: allowedHosts,
        CLOUDFLARE_TURNSTILE_SITE_KEY: config.turnstileEnabled ? config.turnstileSiteKey : '',
        GOOGLE_MAPS_API_KEY: config.googleMapsEnabled || config.googleReviewsEnabled ? config.googleMapsApiKey : '',
        GOOGLE_PLACE_ID: config.googleReviewsEnabled ? config.googlePlaceId : '',
    };
}

function configurationFiles(root: string, config: Configuration, siteUrl: string, allowedHosts: string): Map<string, string> {
    const files = new Map<string, string>();
    files.set(join(root, `.env.${config.storeCode}`), envFile(storeEnvironment(config, siteUrl, allowedHosts)));
    files.set(join(root, 'services/ssr/.env'), envFile(serviceEnvironment(config)));
    files.set(join(root, `services/orchestrator/.env.${config.storeCode}`), envFile(orchestratorEnvironment(config, siteUrl, allowedHosts)));
    files.set(join(root, `mcp/.env.${config.storeCode}`), envFile(mcpEnvironment(config, siteUrl, allowedHosts)));
    files.set(join(root, `browser-mcp/.env.${config.storeCode}`), envFile({SITEURL: siteUrl}));
    return files;
}

function addRuntimeFiles(root: string, files: Map<string, string>, config: Configuration, integrations: Record<string, object>): void {
    for (const parent of ['widgets', 'packages/widget-template']) {
        const dir = join(root, parent);
        if (!existsSync(dir)) continue;
        const entries = readdirSync(dir, {withFileTypes: true}).filter(entry => entry.isDirectory());
        for (const entry of entries) {
            const publicPath = join(dir, entry.name, 'public');
            if (existsSync(publicPath)) {
                files.set(join(publicPath, 'reactedge-runtime.json'), runtimeJson(config, integrations, entry.name));
            }
        }
    }
}

export function planConfiguration(root: string, input: unknown) {
    const config = validateConfiguration(input);
    const workspaceRoot = join(root, 'workspace');
    const storePath = join(workspaceRoot, config.storeCode);
    const samplePath = join(root, 'workspace.sample');
    validateWorkspace(workspaceRoot, storePath, samplePath);

    const siteUrl = config.siteUrl.replace(/\/+$/, '');
    const allowedHosts = allowedHostDetails(config).map(entry => entry.host).join(',');
    const integrations = buildIntegrations(config, siteUrl);
    const files = configurationFiles(root, config, siteUrl, allowedHosts);
    addRuntimeFiles(root, files, config, integrations);

    return {config, files, workspaceRoot, storePath, samplePath, targetWorkspace: join(dirname(config.targetRoot), 'reactedge')};
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