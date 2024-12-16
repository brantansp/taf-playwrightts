import {test, expect} from '@playwright/test';

test.beforeEach('Setup',async ({page}) => {
    await page.goto('http://localhost:4200/');
    await page.locator('(//*[contains(@class,"nb-transition")]/button)[1]').click();
    await page.locator('#nb-option-7').click();

    await page.getByTitle('Forms').click();
    await page.getByTitle('Form Layouts').click();
})

test.describe('Locating elements', () => {
    test('Filling form', async({page})=>{

        // Using in-build filter mechanism
        await page.locator('nb-card', {hasText:"Using the Grid"}).getByRole('textbox', {name : "Email"}).fill('test@example.com');
        await page.locator('nb-card', {has: page.locator('#inputPassword2')}).getByRole('textbox', {name:"Password"}).fill('simplepassword');

        // Using separate filter mechanism
        await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name : "Email"}).fill("test2@example.com");
        await page.locator('nb-card').filter({has: page.locator("#exampleInputPassword1")}).getByRole('textbox',{name: "Password"}).fill("password123");

        // Chaining of filter mechanism
        await page.locator('nb-card').filter({has: page.locator("nb-checkbox")})
            .filter({hasText: "Sign in"}).getByRole('textbox',{name:"Email"}).fill("test3@example.com")

        // Using the navigate back to parent locator
        await page.locator(':text-is("Horizontal form")').locator("..").getByRole('textbox',{name: "Password"}).fill("test4@example.com");

        await page.waitForTimeout(5);
        await page.screenshot({path : 'form_page.png'});
    })

    test('signin test', async({page})=>{
        const basicForm = page.locator('nb-card', {hasText: "Basic form"});
        const userName = basicForm.getByRole('textbox', {name : "Email"});
        const password = basicForm.getByRole('textbox', {name:"Password"});
        const loginButton = basicForm.getByRole('button', {name: "SUBMIT"});

        await userName.fill('test3@example.com');
        await password.fill('password123');
        await loginButton.click();

        await expect (userName).toHaveValue('test3@example.com')
    })

    test('Extracting text', async({page})=>{
        const basicForm = page.locator('nb-card', {hasText: "Basic form"});
        const userName = basicForm.getByRole('textbox', {name : "Email"});
        const password = basicForm.getByRole('textbox', {name:"Password"});
        const loginButton = basicForm.getByRole('button', {name: "SUBMIT"});

        // Extracting element's text value
        const loginButtonText = await loginButton.textContent();
        expect (loginButtonText).toBe('Submit');

        // Extracting all text values
        const allTextValues = await page.locator('nb-radio').allTextContents();
        expect (allTextValues).toContain('Option 1');

        // Extracting input values
        await userName.fill('test3@example.com');
        const inputValues = await userName.inputValue();
        expect (inputValues).toBe('test3@example.com');

        // Extracting attribute values
        const attributeValue = await password.getAttribute('placeholder')
        expect (attributeValue).toBe('Password');
        
    })

    test('assertions', async({page})=>{
        
        // General assertion
        const a = 5
        expect (a).toBe(5)

        const formText = await page.locator('nb-card', {hasText: "Basic form"}).textContent();
        expect (formText).toBe('Basic formEmail addressPasswordCheck me outSubmit')

        // Locator assertion
        const button = page.locator('nb-card', {hasText: "Basic form"}).locator('button');
        await expect (button).toHaveText('Submit');

        // Soft assertion
        await expect.soft(button).toHaveText('Submit')
        await button.click();
    })
})