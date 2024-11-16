import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        baseURL: 'https://www.saucedemo.com/',
        browserName: 'chromium',
        headless: false,
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
    },
    retries: 1,
});
