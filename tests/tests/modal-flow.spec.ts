// tests/modal-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Modal Confirmation Flow', () => {
  test('should handle nested modal interactions', async ({ page }) => {
    // Generate a full HTML page with tabs, modals, and result
    await page.setContent(`
      <html>
        <body>
          <!-- Tabs -->
          <button role="tab" id="responsive-tab">Responsive</button>

          <!-- Open modal button -->
          <button id="open-modal">Open Modal</button>

          <!-- First Modal -->
          <div role="dialog" class="modal" id="first-modal" style="display:none">
            <p>First Modal</p>
            <button id="show-details">Show Details</button>
          </div>

          <!-- Nested Modal -->
          <div role="dialog" class="modal" id="nested-modal" style="display:none">
            <p>Nested Modal</p>
            <button id="confirm">Confirm</button>
          </div>

          <!-- Result -->
          <div id="result" style="display:none"></div>

          <script>
            const firstModal = document.getElementById('first-modal');
            const nestedModal = document.getElementById('nested-modal');
            const openModalBtn = document.getElementById('open-modal');
            const showDetailsBtn = document.getElementById('show-details');
            const confirmBtn = document.getElementById('confirm');
            const result = document.getElementById('result');

            // Open first modal
            openModalBtn.addEventListener('click', () => {
              firstModal.style.display = 'block';
            });

            // Show nested modal
            showDetailsBtn.addEventListener('click', () => {
              nestedModal.style.display = 'block';
            });

            // Confirm in nested modal
            confirmBtn.addEventListener('click', () => {
              nestedModal.style.display = 'none';
              firstModal.style.display = 'none';
              result.textContent = 'confirmed';
              result.style.display = 'block';
            });
          </script>
        </body>
      </html>
    `);

    // Click Responsive tab
    const tab = page.getByRole('tab', { name: 'Responsive' });
    await expect(tab).toBeVisible();
    await tab.click();

    // Open first modal
    const openModalBtn = page.getByRole('button', { name: 'Open Modal' });
    await expect(openModalBtn).toBeVisible();
    await openModalBtn.click();

    const firstModal = page.locator('#first-modal');
    await expect(firstModal).toBeVisible();

    // Show nested modal
    const showDetailsBtn = firstModal.getByRole('button', { name: 'Show Details' });
    await expect(showDetailsBtn).toBeVisible();
    await showDetailsBtn.click();

    const nestedModal = page.locator('#nested-modal');
    await expect(nestedModal).toBeVisible();

    // Confirm in nested modal
    const confirmBtn = nestedModal.getByRole('button', { name: 'Confirm' });
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();

    // Both modals should close
    await expect(firstModal).not.toBeVisible({ timeout: 5000 });
    await expect(nestedModal).not.toBeVisible({ timeout: 5000 });

    // Result should show confirmed
    const result = page.locator('#result');
    await expect(result).toBeVisible();
    await expect(result).toHaveText(/confirmed/i);
  });
});
