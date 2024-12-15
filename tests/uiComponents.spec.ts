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

test('webtables', async({page})=>{
    await page.getByTitle('Tables & Data').click();
    await page.getByText('Smart Table').click();
    await page.waitForLoadState("networkidle");

    const tableRow = await page.getByRole('row', {name:"twitter@outlook.com"})
    await tableRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('90')
    await page.locator('.nb-checkmark').click()

    await page.waitForTimeout(2000)

    await page.locator('li').locator('a',{hasText:"2"}).click()

    const rowId = page.getByRole('row',{name:"11"}).filter({has: page.locator('td').nth(1).getByText("11")})
    await rowId.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('90@90.com')
    await page.locator('.nb-checkmark').click()
    await expect (rowId.locator('td').nth(5)).toHaveText("90@90.com")
    

    const ages = ["20","30","40","200"]

    for (let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)

        const items = page.locator('tbody tr')

        for (let item of await items.all()){
            const val = await item.locator('td').last().textContent()

            if(age == '200'){
                expect(await page.locator('tbody').textContent()).toContain('No data found')
            } else {
                expect(val).toEqual(age)
            }
        }
    }
})

test('date picker', async({page})=>{
    await page.getByTitle('Forms').click();
    await page.getByText('Datepicker').click();
    await page.waitForLoadState("networkidle");

    const calendarInputfield = page.getByPlaceholder('Form Picker')

    await calendarInputfield.click()
    //await page.locator('[class="day-cell ng-star-inserted"]').locator('div', {hasText:"15"}).click()
    //await page.waitForTimeout(2000)
    //await expect(calendarInputfield).toHaveValue("Dec 15, 2024")

    //await calendarInputfield.click()

    let date = new Date();
    date.setDate(date.getDate() + 700)

    const expDate = date.getDate().toString()
    const expMonthShort = date.toLocaleString('En-US',{month: 'short'})
    const expMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expYear = date.getFullYear()
    const dateToAssert = `${expMonthShort} ${expDate}, ${expYear}`

    let calMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expMonthAndYear = `${expMonthLong} ${expYear}`

    while(!calMonthAndYear!.includes(expMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').locator('div', {hasText:expDate}).click()
    await expect(calendarInputfield).toHaveValue(dateToAssert)

})

test('slider test', async({page})=>{
        const dragg = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
        
        // Updating the attribute
        //dragg.evaluate( node => {
        //    node.setAttribute('cx',"232")
        //    node.setAttribute('cy',"232")
        //})

        //await dragg.click()

        // Moving the mouse
        const dragBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
        await dragBox.scrollIntoViewIfNeeded()

        const box = await dragBox.boundingBox();
        const x = box!.x + box!.width/2
        const y = box!.y + box!.height/2

        await page.mouse.move(x,y)
        await page.mouse.down()
        await page.mouse.move(x+100, y)
        await page.mouse.move(x+100, y+100)
        await page.mouse.up()
        await expect(dragBox).toContainText("30")

        await page.waitForTimeout(2000)
})

test('drag and drop', async({page})=>{
    await page.goto('https://www.globalsqa.com/demo-site/draganddrop/')

    const photoManager = page.frameLocator('[rel-title="Photo Manager"] iframe')

    await photoManager.locator('.ui-widget-header', {hasText:"High Tatras 2"}).dragTo(photoManager.locator('#trash'))
    await page.waitForTimeout(2000)

    await photoManager.locator('.ui-widget-header', {hasText:"High Tatras 3"}).hover()
    await page.mouse.down()
    await photoManager.locator("#trash").hover()
    await page.mouse.up()
    await page.waitForTimeout(2000)

    await expect(photoManager.locator('#trash li h5')).toHaveText(['High Tatras 2','High Tatras 3'])
})