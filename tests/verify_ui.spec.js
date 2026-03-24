const { test, expect } = require('@playwright/test');

test('Verify dashboard has webhook configuration and API docs link', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');

  // Check for the Webhook Configuration card
  await expect(page.locator('h2', { hasText: 'Webhook Configuration' })).toBeVisible();

  // Check for the Webhook URL input field
  const webhookInput = page.locator('#webhook-url');
  await expect(webhookInput).toBeVisible();

  // Check for the API Docs link in navigation
  const apiDocsLink = page.locator('a', { hasText: 'API Docs' });
  await expect(apiDocsLink).toBeVisible();

  // Test updating the webhook URL
  const testUrl = 'https://example.com/webhook';
  await webhookInput.fill(testUrl);

  // Handle the alert
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  await page.click('button:has-text("Save Webhook URL")');

  // Refresh and check if it persists
  await page.reload();
  await expect(webhookInput).toHaveValue(testUrl);
});

test('Verify API Docs page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/api-docs/');
  await expect(page).toHaveTitle(/Swagger UI/);
});
