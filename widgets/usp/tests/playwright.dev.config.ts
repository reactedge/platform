import { defineConfig } from '@playwright/test';

export default defineConfig({
    webServer: {
        command: 'pwd && ls -la'
    }
});