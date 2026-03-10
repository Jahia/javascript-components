import {defineConfig} from 'vitest/config';
import {playwright} from '@vitest/browser-playwright';

export default defineConfig({
    esbuild: {
        jsx: 'automatic'
    },
    test: {
        exclude: ['dist'],
        browser: {
            enabled: true,
            provider: playwright(),
            // https://vitest.dev/config/browser/playwright
            instances: [
                {browser: 'chromium'}
            ]
        }
    }
});
