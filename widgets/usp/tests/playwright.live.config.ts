// tests/playwright.dev.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        baseURL: 'https://mageosuk.reactedge.net',
        headless: true,
    },
});
