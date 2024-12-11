import {test, expect} from '@playwright/test';
import { error } from 'console';

test('Navigate to a web page', async ({ page }) => {
  await page.goto('http://od65-preprod-author.digital-astrazeneca.com:4502/');
  await page.waitForLoadState('networkidle');

  if(await page.title() === 'AEM Sign In'){
    await page.getByText('Login Via AZ Ping').click();
  } else {
    throw error
  }

});