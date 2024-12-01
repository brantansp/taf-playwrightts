import {test} from "@playwright/test";

test('open webpage', async ({page}) => {
    await page.goto("https://wdcoder.site/");
    await page.screenshot({ path: "example.png" });
})

test.describe("My App", () => {
    test("should render", async ({page }) => {
        await page.goto("https://wdcoder.site/");
        await page.screenshot({ path: "example.png" });
    });
})