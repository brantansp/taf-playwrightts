import {test} from '@playwright/test';

test.beforeAll('Before All', () => {
    console.log('I am running Before All')
})

test.beforeEach('Before Each', async ({page}) => {
    await page.goto("https://www.saucedemo.com/v1/index.html")
    await page.getByPlaceholder('Username').fill('performance_glitch_user')
    await page.getByPlaceholder('Password').fill('secret_sauce')
    await page.getByText('Login').click()
})

test('test webpage', async ({page}) => {
    console.log('Hello, Playwright!');
    await page.screenshot({path : 'login.png'})
})

test('Add a product', async ({page}) => {
    await page.getByRole('button', {name : "ADD TO CART"}).first().click()
    await page.locator('#shopping_cart_container').click()
    await page.screenshot({path : 'add_to_cart.png'})
})

test.afterEach('After Each', () => {

})

test.afterAll('After All',() =>{

})