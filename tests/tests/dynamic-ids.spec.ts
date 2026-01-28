// tests/dynamic-ids.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dynamic ID Handling', () => {
  test('should select Beta item regardless of ID changes', async ({ page }) => {
    // Mock page with dynamic IDs
    await page.setContent(`
      <html>
        <body>
          <button role="tab" id="tab-flaky">Flaky Selectors</button>
          <ul id="item-list">
            <li data-testid="item-1">Alpha</li>
            <li data-testid="item-2">Beta</li>
            <li data-testid="item-3">Gamma</li>
          </ul>
          <button id="regenerate">Regenerate All IDs</button>
          <script>
            const list = document.getElementById('item-list');
            const regenerateBtn = document.getElementById('regenerate');

            // Dynamic ID regeneration
            regenerateBtn.addEventListener('click', () => {
              Array.from(list.children).forEach(li => {
                li.id = 'item-' + Math.floor(Math.random() * 10000);
              });
            });

            // Selection logic
            list.addEventListener('click', e => {
              if (e.target.tagName === 'LI') {
                Array.from(list.children).forEach(li => li.classList.remove('selected'));
                e.target.classList.add('selected');

                let msg = document.getElementById('message');
                if (!msg) {
                  msg = document.createElement('div');
                  msg.id = 'message';
                  document.body.appendChild(msg);
                }
                msg.textContent = 'Selected: ' + e.target.textContent;
              }
            });
          </script>
        </body>
      </html>
    `);

    // Click Flaky Selectors tab
    const flakyTab = page.getByRole('tab', { name: 'Flaky Selectors' });
    await expect(flakyTab).toBeVisible();
    await flakyTab.click();

    // Click "Regenerate All IDs"
    const regenerateBtn = page.getByRole('button', { name: 'Regenerate All IDs' });
    await expect(regenerateBtn).toBeVisible();
    await regenerateBtn.click();

    // Select Beta by text (ignoring dynamic IDs)
    const betaItem = page.getByText('Beta', { exact: true });
    await expect(betaItem).toBeVisible();
    await betaItem.click();

    // Verify Beta is selected
    await expect(betaItem).toHaveClass(/selected/);
    await expect(page.getByText('Selected: Beta', { exact: true })).toBeVisible();
  });
});
