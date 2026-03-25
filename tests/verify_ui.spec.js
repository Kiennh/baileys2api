const { test, expect } = require('@playwright/test');

test('Verify dashboard has sidebar and Add Account button', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  // Check for sidebar (using id as per new index.html)
  await expect(page.locator('#sidebar')).toBeVisible();
  // Add button is a '+' button now in sidebar-header
  const addBtn = page.locator('#sidebar-header button');
  await expect(addBtn).toBeVisible();
});

test('Verify adding and deleting an account', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  const accountId = 'test_acc_' + Date.now();

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
  await page.click('#sidebar-header button');
  await expect(page.locator('#active-account-id')).toContainText(accountId);
  await expect(page.locator(`#account-list .account-item:has-text("${accountId}")`)).toBeVisible();

  // Delete
  await page.click('button:has-text("Delete")');

  // Should go back to welcome screen
  await expect(page.locator('#welcome-screen')).toBeVisible();
  await expect(page.locator(`#account-list .account-item:has-text("${accountId}")`)).not.toBeVisible();
});

test('Verify API Docs page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/api-docs/');
  await expect(page).toHaveTitle(/Swagger UI/);
});
