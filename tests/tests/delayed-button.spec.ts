// tests/delayed-button.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Delayed Button Flow', () => {
  test('should wait for button to be enabled and click it', async ({ page }) => {
    test.setTimeout(90000); // give more breathing room

    await page.goto(
      'https://claude.ai/public/artifacts/1e02a9a5-4f20-4f19-a7ba-6c3f16c6eab9',
      { waitUntil: 'domcontentloaded' } // changed from networkidle
    );

    // Target the correct iframe explicitly
    const frame = page.frameLocator('iframe[title="Claude content"]');

    // Navigate to Timing Challenges
    const timingTab = frame.getByText('Timing Challenges');
    await timingTab.waitFor({ state: 'visible', timeout: 60000 });
    await timingTab.click();

    // Click Start Process
    const startButton = frame.getByRole('button', { name: /Start Process/i });
    await startButton.waitFor({ state: 'visible', timeout: 60000 });
    await startButton.click();

    // Wait for Confirm Action button to be enabled
    const confirmButton = frame.getByRole('button', { name: /Confirm Action/i });
    await expect(confirmButton).toBeEnabled({ timeout: 30000 });
    await confirmButton.click();

    // Verify success message
    await expect(frame.getByText(/success/i)).toBeVisible({ timeout: 30000 });
  });
});