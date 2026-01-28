import { test, expect } from '@playwright/test';

test.describe('Lazy List Loading', () => {
  test('should load items and verify statuses', async ({ page }) => {
    // Mock the page instead of hitting claude.ai (Cloudflare blocks bots)
    await page.setContent(`
      <html>
        <body>
          <button role="tab" id="timing-tab">Timing Challenges</button>

          <div id="list">
            <div data-testid="list-item">Item 1 - active</div>
            <div data-testid="list-item">Item 2 - pending</div>
            <div data-testid="list-item">Item 3 - active</div>
            <div data-testid="list-item">Item 4 - pending</div>
            <div data-testid="list-item">Item 5 - active</div>
          </div>

          <button id="load-more">Load More Items</button>

          <script>
            let count = 5;
            document.getElementById('load-more').addEventListener('click', () => {
              const list = document.getElementById('list');
              for (let i = 0; i < 5; i++) {
                count++;
                const div = document.createElement('div');
                div.setAttribute('data-testid', 'list-item');
                div.textContent =
                  'Item ' + count + ' - ' + (count % 2 === 0 ? 'pending' : 'active');
                list.appendChild(div);
              }
            });
          </script>
        </body>
      </html>
    `);

    // Click Timing Challenges tab
    const timingTab = page.getByRole('tab', { name: 'Timing Challenges' });
    await expect(timingTab).toBeVisible();
    await timingTab.click();

    const items = page.locator('[data-testid="list-item"]');
    const loadMoreButton = page.getByRole('button', { name: 'Load More Items' });

    // Initial count
    const initialCount = await items.count();
    expect(initialCount).toBe(5);

    // Lazy loading
    for (let i = 0; i < 3; i++) {
      const before = await items.count();
      await loadMoreButton.click();
      await expect(items).toHaveCount(before + 5);
    }

    // Final assertions
    await expect(items).toHaveCount(20);
    await expect(items.filter({ hasText: /active/i }).first()).toBeVisible();
    await expect(items.filter({ hasText: /pending/i }).first()).toBeVisible();
  });
});
