import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'artifacts/e2e-results.json' }]],
  use: { baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:4173', trace: 'retain-on-failure', launchOptions: { channel: process.env.TEST_BROWSER_CHANNEL || undefined } },
  projects: [{ name:'desktop', use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}} },{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
})
