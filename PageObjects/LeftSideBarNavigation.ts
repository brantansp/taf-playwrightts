import {Locator, Page} from '@playwright/test'

export class LeftSideBarNavigation{
    
    readonly page: Page
    readonly formLayouts: Locator
    readonly toastr: Locator
    readonly tooltip: Locator
    readonly smarttable: Locator
    readonly datepicker: Locator

    constructor (page : Page) {
        this.page = page
        this.formLayouts = this.page.getByTitle('Form Layouts')
        this.toastr = this.page.getByTitle('Toastr')
        this.tooltip = this.page.getByTitle('Tooltip')
        this.smarttable = this.page.getByTitle('Smart Table')
        this.datepicker = this.page.getByTitle('Datepicker')
    }

    async navigateToFormLayout(){
        await this.openSideBarIfNotOpened("Forms")
        await this.formLayouts.click();
    }

    async navigateToToastr(){
        await this.openSideBarIfNotOpened("Modal & Overlays")
        await this.toastr.click();
    }

    async navigateToTooltip(){
        await this.openSideBarIfNotOpened("Modal & Overlays")
        await this.tooltip.click();
    }

    async navigateToSmartTable(){
        await this.openSideBarIfNotOpened("Tables & Data")
        await this.smarttable.click();
    }

    async navigateToDatePicker(){
        await this.openSideBarIfNotOpened("Forms")
        await this.datepicker.click();
    }

    async openSideBarIfNotOpened(s : String){
        const isOpened = await this.page.locator(`[title="${s}"]`).getAttribute("aria-expanded")
        if (isOpened == "false"){
            await this.page.getByTitle(`${s}`).click()
        }
    }
}