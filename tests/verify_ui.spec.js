const { test, expect } = require('@playwright/test');

test('Verify dashboard has sidebar and Add Account button', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');

  // Check for the Sidebar
  await expect(page.locator('.sidebar')).toBeVisible();

  // Check for the Add Account button
  const addBtn = page.locator('button:has-text("Add Account")');
  await expect(addBtn).toBeVisible();

  // Check for the API Docs link in navigation
  const apiDocsLink = page.locator('a', { hasText: 'API Docs' });
  await expect(apiDocsLink).toBeVisible();
});

test('Verify adding an account and configuring webhook', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');

  const accountId = 'test_acc_123';

  // Handle prompt
  page.on('dialog', async dialog => {
    if (dialog.type() === 'prompt') {
      await dialog.accept(accountId);
    } else if (dialog.type() === 'alert') {
      await dialog.accept();
    }
  });

  await page.click('button:has-text("Add Account")');

  // Check if account ID is visible in the main content
  await expect(page.locator('#active-account-id')).toContainText(accountId);

  // Configure webhook
  const testUrl = 'https://example.com/webhook';
  const webhookInput = page.locator('#webhook-url');
  await webhookInput.fill(testUrl);
  await page.click('button:has-text("Save Webhook URL")');

  // Refresh and check if it persists
  await page.reload();

  // Re-select the account (sidebar)
  await page.click(`.account-item:has-text("${accountId}")`);

  await expect(webhookInput).toHaveValue(testUrl);
});

test('Verify API Docs page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/api-docs/');
  await expect(page).toHaveTitle(/Swagger UI/);
});
