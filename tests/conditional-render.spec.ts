// tests/conditional-render.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Conditional Login Flow', () => {
  test('should handle admin and standard user login flows', async ({ page }) => {
    // Mock page content
    await page.setContent(`
      <html>
        <body>
          <button role="tab">Flaky Selectors</button>

          <div id="login-buttons">
            <button id="admin-btn">Admin User</button>
            <button id="standard-btn">Standard User</button>
          </div>

          <div id="dashboard">
            <div id="admin-panel" class="panel" style="display:none">Admin Panel</div>
            <div id="standard-panel" class="panel" style="display:none">Standard Panel</div>
          </div>

          <button id="logout-btn" style="display:none">Logout</button>

          <script>
            const adminBtn = document.getElementById('admin-btn');
            const standardBtn = document.getElementById('standard-btn');
            const logoutBtn = document.getElementById('logout-btn');
            const adminPanel = document.getElementById('admin-panel');
            const standardPanel = document.getElementById('standard-panel');

            function showPanel(panel) {
              adminPanel.style.display = 'none';
              standardPanel.style.display = 'none';
              panel.style.display = 'block';
              logoutBtn.style.display = 'inline-block';
            }

            adminBtn.addEventListener('click', () => showPanel(adminPanel));
            standardBtn.addEventListener('click', () => showPanel(standardPanel));
            logoutBtn.addEventListener('click', () => {
              adminPanel.style.display = 'none';
              standardPanel.style.display = 'none';
              logoutBtn.style.display = 'none';
            });
          </script>
        </body>
      </html>
    `);

    // Click Flaky Selectors tab
    const tab = page.getByRole('tab', { name: 'Flaky Selectors' });
    await expect(tab).toBeVisible();
    await tab.click();

    // Admin user flow
    const adminBtn = page.getByRole('button', { name: 'Admin User' });
    await expect(adminBtn).toBeVisible();
    await adminBtn.click();

    const adminPanel = page.locator('#admin-panel');
    const standardPanel = page.locator('#standard-panel');

    await expect(adminPanel).toBeVisible();
    await expect(standardPanel).not.toBeVisible();

    // Logout
    const logoutBtn = page.getByRole('button', { name: 'Logout' });
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // Standard user flow
    const standardBtn = page.getByRole('button', { name: 'Standard User' });
    await expect(standardBtn).toBeVisible();
    await standardBtn.click();

    await expect(standardPanel).toBeVisible();
    await expect(adminPanel).not.toBeVisible();
  });
});
