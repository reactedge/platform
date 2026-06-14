// tests/playwright.dev.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        baseURL: 'http://localhost:5173',
        headless: true,
    },
});
