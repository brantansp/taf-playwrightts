import {Locator, Page, test, expect} from '@playwright/test'
import { helperBase } from './helperBase'

export class FormLayoutsPage extends helperBase{

    readonly page: Page
    readonly basicForm: Locator
    readonly userNameBox: Locator
    readonly passwordBox: Locator
    readonly loginButton: Locator

    constructor(page: Page){
        super(page)
        this.page = page
        this.basicForm = this.page.locator('nb-card', {hasText: "Basic form"});
        this.userNameBox = this.basicForm.getByRole('textbox', {name : "Email"});
        this.passwordBox = this.basicForm.getByRole('textbox', {name:"Password"});
        this.loginButton = this.basicForm.getByRole('button', {name: "SUBMIT"});
    }

    /**
     * This method is to fill the username and password
     * @param userName - should be alphanumeric and not null
     * @param password - should not be empty
     */
    async enterUserNameAndPasswordToSubmit(userName: String, password: String){
        await this.userNameBox.fill(`${userName}`);
        await this.passwordBox.fill(`${password}`);
        await this.loginButton.click();
        await this.waitForTimeOut(2000)
        await expect(this.userNameBox).toHaveValue(`${userName}`)
    }
}