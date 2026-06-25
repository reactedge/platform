import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: '../widgets',
    testMatch: '**/tests/**/*.spec.ts',
    use: {
        baseURL: 'http://localhost:5173',
        ignoreHTTPSErrors: true,
        headless: true,
    },
});