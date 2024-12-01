import {test, expect} from '@playwright/test';

test.beforeEach('Setup', async ({page}) => {
    await page.goto('http://uitestingplayground.com/ajax');
    await page.getByText('Button Triggering AJAX Request').click();
})

test('autowait', async({page})=>{
   const successMessage =  page.locator('.bg-success')

   // By default, playwright waits 30s for an element to be visible when methods like click is used
   //await successMessage.click();

   //If we need to get the text then wait needs to be imoplemented explicitly
   //await successMessage.waitFor({state: 'visible'});
   // or
   //await page.waitForSelector('.bg-success');

   // We can also wait for based on the API response time using waitForResponse
   await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

   // Waiting for entire newtwork to be idle [NOT RECOMMENDED]
   //await page.waitForLoadState('networkidle')

   // Hard sleep
   //await page.waitForTimeout(5000);

   const text = await successMessage.allTextContents();
   expect (text).toContain('Data loaded with AJAX get request.');

   // ToHaveText method has autowait by default
   //await expect(successMessage).toHaveText('Data loaded with AJAX get request.');
})

test('timeout', async({page})=>{
    // Global timeout : default not set
    // Test timeout : 30s by default
    // Action timeout : default not set
    // Navigation timeout : default not set
    // Expect timeout : 5s by default for locator assertions only. Not for general assertions.


    // To configure global timeout and test timeout we can set 'globalTimeout:10000' and 'timeout:10000' under defineConfig in playwright.config.ts
    // To configure action timeout and navigation timeout, we can use actionTimeout and navigationTimeout under 'Use'
    // To configure expect timeout, we can use set 'expect:{timeout : 10000}' under defineConfig in playwright.config.ts

    // Action timeout can be override for each action by specifying it as an option. E.g userName.click({timeout: 5000})
    // Expect timeout can be override for each expect by specifying it as an option. E.g expect(successMessage).toHaveText('Data loaded with AJAX get request', {timeout: 5000}) 

    // We can override the test timeout using the test.setTimeout(10000) method
    // We can specify a test to be a test.slow() to increase the timeout for slow tests by 3x

    // To increase the test timeout for all tests in a spec file by
    // specifying testInfo.setTimeout(testInfo.timeout + 10000) in the beforeEach hook
})