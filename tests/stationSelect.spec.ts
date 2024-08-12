import { test, expect, type Page } from "@playwright/test";

test("Infinite loading", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Click on the station search input
  await page.click('input[placeholder="Search stations"]');

  // Type a partial station name
  await page.fill('input[placeholder="Search stations"]', "EWX");

  // Wait for the dropdown to appear and select the first station
  await page.waitForSelector(".absolute.top-full div");
  await page.click(".absolute.top-full div:first-child");

  // Wait for the hourly data to load
  await page.waitForSelector("table");

  // Get the initial number of rows
  let newRowCount = await page.locator("table tbody tr").count();

  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => {
      const tableContainer = document.querySelector(".overflow-auto");
      if (tableContainer) {
        tableContainer.scrollTop = tableContainer.scrollHeight;
      }
    });

    await page.waitForTimeout(2000);

    const latestRowCount = await page.locator("table tbody tr").count();
    expect(latestRowCount).toBeGreaterThan(newRowCount);
    newRowCount = latestRowCount;
  }
});
