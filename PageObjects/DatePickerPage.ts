import {Page, expect} from '@playwright/test'

export class DatePickerPage{
    private readonly page:Page

    constructor(page: Page){
        this.page = page
    }

    async selectFormDatePicker(dateToSelect:number){
        const calendarInputfield = this.page.getByPlaceholder('Form Picker')
        await calendarInputfield.click()
        const dateToAssert = await this.selectDate(dateToSelect)
        await expect(calendarInputfield).toHaveValue(dateToAssert)
    }

    async selectRangeDatePicker(startdate:number , enddate:number){
        const calendarInputfield = this.page.getByPlaceholder('Ran Picker')
        await calendarInputfield.click()
        const dateToAssertStart = await this.selectDate(startdate)
        const dateToAssertEnd = await this.selectDate(enddate)

        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`

        await expect(calendarInputfield).toHaveValue(dateToAssert)
    }

    private async selectDate(numberOfDays: number){
        let date = new Date();
        date.setDate(date.getDate() + numberOfDays)
    
        const expDate = date.getDate().toString()
        const expMonthShort = date.toLocaleString('En-US',{month: 'short'})
        const expMonthLong = date.toLocaleString('En-US', {month: 'long'})
        const expYear = date.getFullYear()
        const dateToAssert = `${expMonthShort} ${expDate}, ${expYear}`
    
        let calMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expMonthAndYear = `${expMonthLong} ${expYear}`
    
        while(!calMonthAndYear!.includes(expMonthAndYear)){
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
    
        await this.page.locator('.day-cell.ng-star-inserted').locator('div', {hasText:expDate}).click()

        return dateToAssert
    }
}