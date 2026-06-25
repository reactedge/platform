import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: '../widgets',
    testMatch: '**/tests/**/*.spec.ts',
    maxFailures: 1,
    use: {
        baseURL: 'https://mageos-docker.magsite.co.uk',
        ignoreHTTPSErrors: true,
        headless: true,
        trace: 'on',
        video: 'on',
        screenshot: 'only-on-failure',
    }
});