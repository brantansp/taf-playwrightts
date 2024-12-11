import {test, expect} from '@playwright/test';

test.beforeEach( async({page})=>{
    await page.goto('http://localhost:4200/');
    await page.locator('(//*[contains(@class,"nb-transition")]/button)[1]').click();
    await page.locator('#nb-option-7').click();
})

test.describe('For layout page', () => {
    test.beforeEach(async({page})=>{
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
        await page.waitForLoadState("networkidle");
    })

    test('input fields',async({page})=>{
        const emailTextBox = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name : "Email"});

        // Using fill() method
        //await emailTextBox.fill('test@example.com');
        await emailTextBox.clear();

        // Using pressSequentially() method
        //await emailTextBox.pressSequentially('test@example.com');

        // Using pressSequentially() method with modifiers
        await emailTextBox.pressSequentially('test@example.com', {delay: 500} );

        const emailTextBoxValue = await emailTextBox.inputValue();

        // Generic assertion
        expect(emailTextBoxValue).toEqual('test@example.com');

        // Locator assertion
        expect (emailTextBox).toHaveValue('test@example.com');
    })

    test('radio buttons', async({page})=>{
        const radioButtonForm = page.locator('nb-card').filter({hasText:"Using the Grid"});

        // Using the visible text and click() on the text
        //const option1 = radioButtonForm.getByText('Option 1')
        //const option2 = radioButtonForm.getByText('Option 2')

        //option1.click()
        //option2.click()

        // Using the getByLabel radio button check() method
        radioButtonForm.getByLabel('Option 1').check({force: true})
        await page.waitForTimeout(1000)
        expect(await radioButtonForm.getByLabel('Option 1').isChecked()).toBeTruthy()

        // Using the getByRole radio button and check() method
        radioButtonForm.getByRole('radio', {name:"Option 2"}).check({force:true})
        await page.waitForTimeout(1000)
        expect(await radioButtonForm.getByLabel('Option 2').isChecked()).toBeTruthy()
        expect(await radioButtonForm.getByRole('radio', {name:'Option 1'}).isChecked()).toBeFalsy()
        
    })
})

test('checkbox tests', async({page})=>{
    await page.getByTitle('Modal & Overlays').click();
    await page.getByText('Toastr').click();
    await page.waitForLoadState("networkidle");

    // Getting checkbox by label
    const hideOnClickCheckboxByLabel = page.getByLabel('Hide on click')

    // Getting checkbox by role
    const hideOnClickCheckboxByRole = page.getByRole('checkbox',{name:'Hide on click'});

    // Using click to perform action despite the state of the element
    await hideOnClickCheckboxByRole.click({force:true})
    await page.waitForTimeout(1000)

    // Using check() which will check the element state before performing check action
    await hideOnClickCheckboxByRole.check({force:true})
    await page.waitForTimeout(1000)

    // Using uncheck(), similar to check it will check the element state before performing action
    await hideOnClickCheckboxByRole.uncheck({force:true})

    const allCheckBox = page.getByRole('checkbox')

    for(const checkbox of await allCheckBox.all()){
        await checkbox.uncheck({force:true})
        expect (await checkbox.isChecked()).toBeFalsy()
    }
})


test('select dropdown', async({page}) => {
    const dd = page.locator('ngx-header nb-select')
    await dd.click()

    const selects = page.getByRole('list') // returns all the ul items
    const selectsOptions = page.getByRole('listitem') //returns all the li items

    // We can identify the listitems by locator chaining
    //const dropdown = page.getByRole('list').locator('nb-option')

    const dropdown = page.locator('nb-option-list nb-option')
    expect (dropdown).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])

    await dropdown.filter({hasText:"Light"}).click()
    expect (page.locator('nb-layout-header')).toHaveCSS('background-color','rgb(255, 255, 255)')

    // Logic to select all profiles and verifies the same
    const colors = {
        "Light":"rgb(255, 255, 255)",
        "Dark":"rgb(34, 43, 69)",
        "Cosmic":"rgb(50, 50, 89)",
        "Corporate":"rgb(255, 255, 255)"
    }

    dd.click()
    for (const color in colors){
        await dropdown.filter({hasText: color}).click()
        expect (page.locator('nb-layout-header')).toHaveCSS('background-color', colors[color])
        page.waitForTimeout(1000)
        dd.click()
    }
})

test('tooltip test', async({page}) => {
    await page.getByTitle('Modal & Overlays').click();
    await page.getByText('Tooltip').click();
    await page.waitForLoadState("networkidle");

    // Using hover to hover on the element
    const card = page.locator('nb-card', {hasText:'Tooltip Placements'}).locator('button', {hasText:'Top'})
    await card.hover()
    page.waitForTimeout(1000)

    const tooltip = page.getByRole('tooltip') // For this to work the tooltip should have role='tooltip'

    expect (await page.locator('nb-tooltip').textContent()).toEqual('This is a tooltip')
})

test('windows dialog', async({page})=>{
    await page.getByTitle('Tables & Data').click();
    await page.getByText('Smart Table').click();
    await page.waitForLoadState("networkidle");

    // Dialog listner will by default dismiss the windows dialog =.
    // We need to perform action explicitly 
    page.on('dialog', dialog => {
        expect (dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    const deleteButton = page.locator('table').locator('tr').locator('.nb-trash').first()
    await deleteButton.click();

    await page.waitForTimeout(1000);
})