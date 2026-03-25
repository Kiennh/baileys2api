const { test, expect } = require('@playwright/test');

test('Verify dashboard has sidebar and Add Account button', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page.locator('.sidebar')).toBeVisible();
  const addBtn = page.locator('button:has-text("Add Account")');
  await expect(addBtn).toBeVisible();
});

test('Verify adding and deleting an account', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  const accountId = 'test_acc_to_delete';

  // Handle prompt for add and confirm for delete
  page.on('dialog', async dialog => {
    if (dialog.type() === 'prompt') {
      await dialog.accept(accountId);
    } else if (dialog.type() === 'confirm') {
      await dialog.accept();
    } else if (dialog.type() === 'alert') {
      await dialog.accept();
    }
  });

  // Add
  await page.click('button:has-text("Add Account")');
  await expect(page.locator('#active-account-id')).toContainText(accountId);
  await expect(page.locator(`.account-item:has-text("${accountId}")`)).toBeVisible();

  // Delete
  await page.click('button:has-text("Delete Account")');

  // Should go back to welcome screen
  await expect(page.locator('#welcome-screen')).toBeVisible();
  await expect(page.locator(`.account-item:has-text("${accountId}")`)).not.toBeVisible();
});

test('Verify API Docs page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/api-docs/');
  await expect(page).toHaveTitle(/Swagger UI/);
});
