import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { allowedHostDetails, applyConfiguration, listEnvironments, previewConfiguration, readConfiguration, readConfigurationTemplate, retainAdvancedSsrSettings } from './configuration.ts';

function writeWorkspaceSample(root: string) {
    mkdirSync(join(root, 'workspace.sample/default/contracts'), { recursive: true });
    mkdirSync(join(root, 'workspace.sample/release/source'), { recursive: true });
    writeFileSync(join(root, 'workspace.sample/registry.json'), '{}');
    writeFileSync(join(root, 'workspace.sample/default/contracts/example.json'), '{}');
    writeFileSync(join(root, 'workspace.sample/release/source/example.txt'), 'release');
}

test('preview and save cover all configuration outputs without touching a real host', () => {
    const root = mkdtempSync(join(tmpdir(), 'reactedge-config-'));
    const targetParent = mkdtempSync(join(tmpdir(), 'reactedge-target-'));
    try {
        writeWorkspaceSample(root);
        mkdirSync(join(root, 'widgets/usp/public'), { recursive: true });
        mkdirSync(join(root, 'packages/widget-template/runtime/public'), { recursive: true });
        writeFileSync(join(root, '.env.sample'), 'SITEURL=https://example.org\nALLOWED_HOSTS=localhost\n');
        const config = {
            ...readConfiguration(root, 'fr'), targetRoot: join(targetParent, 'magento'),
            siteUrl: 'https://example.org/', observabilityEnabled: true, turnstileEnabled: true,
            turnstileSiteKey: 'site-key', googleMapsEnabled: true, googleReviewsEnabled: true,
            googleMapsApiKey: 'a"b\\c', googlePlaceId: 'place-123',
        };
        const preview = previewConfiguration(root, config);
        assert.equal(preview.workspace, 'create from sample');
        assert.ok(preview.changed.includes('widgets/usp/public/reactedge-runtime.json'));
        assert.ok(preview.changed.includes('services/orchestrator/.env.fr'));
        assert.throws(() => readFileSync(join(root, '.env.fr')));
        applyConfiguration(root, config);
        assert.deepEqual(JSON.parse(readFileSync(join(root, 'widgets/usp/public/reactedge-runtime.json'), 'utf8')).integrations.googleMaps,
            { apiKey: 'a"b\\c', placeId: 'place-123' });
        const mcpEnv = readFileSync(join(root, 'mcp/.env.fr'), 'utf8');
        assert.match(mcpEnv, /CLOUDFLARE_TURNSTILE_SITE_KEY='site-key'/);
        assert.match(mcpEnv, /GOOGLE_MAPS_API_KEY='a"b\\c'/);
        assert.match(mcpEnv, /GOOGLE_PLACE_ID='place-123'/);
        assert.equal(readFileSync(join(root, 'workspace/registry.json'), 'utf8'), '{}');
        assert.equal(readFileSync(join(root, 'workspace/fr/contracts/example.json'), 'utf8'), '{}');
        assert.equal(readConfiguration(root, 'fr').googleMapsApiKey, 'a"b\\c');
        assert.equal(previewConfiguration(root, config).changed.length, 0);
    } finally {
        rmSync(root, { recursive: true, force: true });
        rmSync(targetParent, { recursive: true, force: true });
    }
});

test('rejects unsafe store paths and incomplete optional services before writing', () => {
    const root = mkdtempSync(join(tmpdir(), 'reactedge-config-'));
    try {
        writeWorkspaceSample(root);
        const defaults = readConfiguration(root, 'default');
        assert.throws(() => previewConfiguration(root, { ...defaults, storeCode: '../other' }), /Store code/);
        assert.throws(() => previewConfiguration(root, { ...defaults, googleReviewsEnabled: true }), /Google Maps/);
        assert.throws(() => previewConfiguration(root, { ...defaults, targetRoot: 'relative/path' }), /absolute/);
        assert.throws(() => previewConfiguration(root, { ...defaults, category: "one' two" }), /apostrophe/);
    } finally { rmSync(root, { recursive: true, force: true }); }
});

test('sites without a catalog do not require or write demo SKU and category', () => {
    const root = mkdtempSync(join(tmpdir(), 'reactedge-config-'));
    const targetParent = mkdtempSync(join(tmpdir(), 'reactedge-target-'));
    try {
        writeWorkspaceSample(root);
        mkdirSync(join(root, 'widgets/usp/public'), { recursive: true });
        const defaults = readConfiguration(root, 'site');
        assert.throws(() => previewConfiguration(root, { ...defaults, sku: '', category: '' }), /catalog/);
        const config = { ...defaults, hasCatalog: false, sku: '', category: '', targetRoot: join(targetParent, 'site') };
        assert.match(previewConfiguration(root, config).note, /Catalog widgets/);
        applyConfiguration(root, config);
        const env = readFileSync(join(root, '.env.site'), 'utf8');
        assert.match(env, /CATALOG_ENABLED='0'/);
        assert.doesNotMatch(env, /^SKU=|^CATEGORY=/m);
        const runtime = JSON.parse(readFileSync(join(root, 'widgets/usp/public/reactedge-runtime.json'), 'utf8'));
        assert.deepEqual(runtime.context, { storeCode: 'site' });
        assert.equal(readConfiguration(root, 'site').hasCatalog, false);
    } finally {
        rmSync(root, { recursive: true, force: true });
        rmSync(targetParent, { recursive: true, force: true });
    }
});

test('hidden SSR settings survive saving other fields and disabling SSR', () => {
    const root = mkdtempSync(join(tmpdir(), 'reactedge-config-'));
    const targetParent = mkdtempSync(join(tmpdir(), 'reactedge-target-'));
    try {
        writeWorkspaceSample(root);
        writeFileSync(join(root, '.env.site'), "SSR_PORT='4501'\nSSR_BASE_URL='https://legacy.example/ssr'\nSSR_ENABLED='1'\n");
        const submitted: Record<string, unknown> = {
            ...readConfiguration(root, 'site'), ssrEnabled: false, category: 'new-category', targetRoot: join(targetParent, 'site'),
        };
        delete submitted.ssrPort;
        delete submitted.ssrBaseUrl;
        applyConfiguration(root, retainAdvancedSsrSettings(root, submitted));
        const env = readFileSync(join(root, '.env.site'), 'utf8');
        assert.match(env, /SSR_ENABLED='0'/);
        assert.match(env, /SSR_PORT='4501'/);
        assert.match(env, /SSR_BASE_URL='https:\/\/legacy.example\/ssr'/);
        assert.match(readFileSync(join(root, 'services/ssr/.env'), 'utf8'), /SSR_PORT='4501'/);
    } finally {
        rmSync(root, { recursive: true, force: true });
        rmSync(targetParent, { recursive: true, force: true });
    }
});

test('maps and reviews independently require the shared Google API key', () => {
    const root = mkdtempSync(join(tmpdir(), 'reactedge-config-'));
    const targetParent = mkdtempSync(join(tmpdir(), 'reactedge-target-'));
    try {
        writeWorkspaceSample(root);
        mkdirSync(join(root, 'widgets/storefinder/public'), { recursive: true });
        const defaults = { ...readConfiguration(root, 'maps'), targetRoot: join(targetParent, 'site') };
        assert.throws(() => previewConfiguration(root, { ...defaults, googleMapsEnabled: true }), /API key/);
        const maps = { ...defaults, googleMapsEnabled: true, googleMapsApiKey: 'shared-key' };
        applyConfiguration(root, maps);
        const mapRuntime = JSON.parse(readFileSync(join(root, 'widgets/storefinder/public/reactedge-runtime.json'), 'utf8'));
        assert.deepEqual(mapRuntime.integrations.googleMaps, { apiKey: 'shared-key' });
        assert.equal(readConfiguration(root, 'maps').googleMapsEnabled, true);
        assert.match(readFileSync(join(root, '.env.maps'), 'utf8'), /GOOGLE_MAPS_API_KEY='shared-key'/);
        assert.match(readFileSync(join(root, 'mcp/.env.maps'), 'utf8'), /GOOGLE_MAPS_API_KEY='shared-key'/);

        const reviews = { ...maps, storeCode: 'reviews', googleMapsEnabled: false, googleReviewsEnabled: true };
        assert.throws(() => previewConfiguration(root, reviews), /Place ID/);
        applyConfiguration(root, { ...reviews, googlePlaceId: 'place-123' });
        const reviewsRuntime = JSON.parse(readFileSync(join(root, 'widgets/storefinder/public/reactedge-runtime.json'), 'utf8'));
        assert.deepEqual(reviewsRuntime.integrations.googleMaps, { apiKey: 'shared-key', placeId: 'place-123' });
        const reviewsMcpEnv = readFileSync(join(root, 'mcp/.env.reviews'), 'utf8');
        assert.match(reviewsMcpEnv, /GOOGLE_MAPS_API_KEY='shared-key'/);
        assert.match(reviewsMcpEnv, /GOOGLE_PLACE_ID='place-123'/);
        assert.equal(readConfiguration(root, 'reviews').googleMapsEnabled, false);
        assert.equal(readConfiguration(root, 'reviews').googleReviewsEnabled, true);
    } finally {
        rmSync(root, { recursive: true, force: true });
        rmSync(targetParent, { recursive: true, force: true });
    }
});

test('site and development hosts are explained and external contract hosts are explicit', () => {
    const root = mkdtempSync(join(tmpdir(), 'reactedge-config-'));
    const targetParent = mkdtempSync(join(tmpdir(), 'reactedge-target-'));
    try {
        writeWorkspaceSample(root);
        writeFileSync(join(root, '.env.sample'), 'SITEURL=https://old.example\nALLOWED_HOSTS=localhost,127.0.0.1,old.example\n');
        const config = {
            ...readConfiguration(root, 'site'), siteUrl: 'https://new.example/path',
            additionalHosts: 'cdn.example, NEW.EXAMPLE, cdn.example', targetRoot: join(targetParent, 'site'),
        };
        assert.equal(readConfiguration(root, 'site').additionalHosts, '');
        const preview = previewConfiguration(root, config);
        assert.deepEqual(preview.allowedHosts, [
            { host: 'new.example', reason: 'Site URL (always allowed)' },
            { host: 'localhost', reason: 'Local development' },
            { host: '127.0.0.1', reason: 'Local development' },
            { host: 'cdn.example', reason: 'Additional contract URL' },
        ]);
        applyConfiguration(root, config);
        const env = readFileSync(join(root, '.env.site'), 'utf8');
        assert.match(env, /ALLOWED_HOSTS='new.example,localhost,127.0.0.1,cdn.example'/);
        assert.equal(readConfiguration(root, 'site').additionalHosts, 'cdn.example');
        const production = { ...config, environment: 'production', additionalHosts: '' };
        assert.deepEqual(allowedHostDetails(production).map(entry => entry.host), ['new.example']);
        assert.throws(() => previewConfiguration(root, { ...config, additionalHosts: 'https://cdn.example' }), /hostname/);
    } finally {
        rmSync(root, { recursive: true, force: true });
        rmSync(targetParent, { recursive: true, force: true });
    }
});

test('fresh clones have no environments and create a store from the sample layout', () => {
    const root = mkdtempSync(join(tmpdir(), 'reactedge-config-'));
    const targetParent = mkdtempSync(join(tmpdir(), 'reactedge-target-'));
    try {
        writeWorkspaceSample(root);
        writeFileSync(join(root, '.env.sample'), 'SITEURL=https://sample.example\nSTORE_CODE=default\n');
        assert.deepEqual(listEnvironments(root), []);
        const template = readConfigurationTemplate(root);
        assert.equal(template.storeCode, '');
        assert.equal(template.siteUrl, 'https://sample.example');

        const config = { ...template, storeCode: 'new-store', targetRoot: join(targetParent, 'site') };
        const preview = previewConfiguration(root, config);
        assert.equal(preview.workspace, 'create from sample');
        assert.deepEqual(preview.workspaceSetup, [
            'workspace/new-store/ from workspace.sample/default/',
            'workspace/registry.json from workspace.sample/',
            'workspace/release/ from workspace.sample/release/',
        ]);
        applyConfiguration(root, config);
        assert.deepEqual(listEnvironments(root), [{ storeCode: 'new-store', siteUrl: 'https://sample.example' }]);
        assert.equal(readFileSync(join(root, 'workspace/registry.json'), 'utf8'), '{}');
        assert.equal(readFileSync(join(root, 'workspace/new-store/contracts/example.json'), 'utf8'), '{}');
        assert.equal(readFileSync(join(root, 'workspace/release/source/example.txt'), 'utf8'), 'release');
        assert.equal(previewConfiguration(root, config).workspace, 'existing');
        assert.deepEqual(previewConfiguration(root, config).workspaceSetup, []);

        writeFileSync(join(root, '.env.default'), 'SITEURL=https://existing.example\n');
        assert.equal(readConfigurationTemplate(root).siteUrl, 'https://sample.example');
    } finally {
        rmSync(root, { recursive: true, force: true });
        rmSync(targetParent, { recursive: true, force: true });
    }
});

test('seller listing settings write only the createlisting seller runtime context', () => {
    const root = mkdtempSync(join(tmpdir(), 'reactedge-config-'));
    const targetParent = mkdtempSync(join(tmpdir(), 'reactedge-target-'));
    try {
        writeWorkspaceSample(root);
        mkdirSync(join(root, 'widgets/createlisting/public'), { recursive: true });
        mkdirSync(join(root, 'widgets/usp/public'), { recursive: true });

        const defaults = readConfiguration(root, 'seller');
        const config = {
            ...defaults,
            targetRoot: join(targetParent, 'site'),
            sellerListingEnabled: true,
            defaultSellerId: 'seller-123',
        };

        applyConfiguration(root, config);

        const listingRuntime = JSON.parse(
            readFileSync(join(root, 'widgets/createlisting/public/reactedge-runtime.json'), 'utf8')
        );
        const uspRuntime = JSON.parse(
            readFileSync(join(root, 'widgets/usp/public/reactedge-runtime.json'), 'utf8')
        );

        assert.equal(listingRuntime.context.sellerId, 'seller-123');
        assert.equal(uspRuntime.context.sellerId, undefined);

        const env = readFileSync(join(root, '.env.seller'), 'utf8');
        assert.match(env, /SELLER_LISTING_ENABLED='1'/);
        assert.match(env, /DEFAULT_SELLER_ID='seller-123'/);

        const loaded = readConfiguration(root, 'seller');
        assert.equal(loaded.sellerListingEnabled, true);
        assert.equal(loaded.defaultSellerId, 'seller-123');

        assert.throws(
            () => previewConfiguration(root, { ...config, defaultSellerId: '' }),
            /Default Seller ID/
        );
    } finally {
        rmSync(root, { recursive: true, force: true });
        rmSync(targetParent, { recursive: true, force: true });
    }
});
