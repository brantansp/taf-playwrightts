import {test,expect} from '../PageObjects/BasePage'


test.beforeEach( async({page})=>{
    await page.goto('http://localhost:4200/');
    await page.locator('(//*[contains(@class,"nb-transition")]/button)[1]').click();
    await page.locator('#nb-option-7').click();
})

test('testing datepicker', async({page})=>{
    await page.getByTitle('Forms').click();
    await page.getByText('Datepicker').click();
    await page.waitForLoadState("networkidle");

    const calendarInputfield = page.getByPlaceholder('Form Picker')

    await calendarInputfield.click()

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