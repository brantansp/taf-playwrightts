import { Page } from "playwright";


export class helperBase{
    readonly page: Page
    constructor (page: Page){
        this.page = page
    }

    async waitForTimeOut(numberOfSecondsToWait: number){
        await this.page.waitForTimeout(numberOfSecondsToWait)
    }
}