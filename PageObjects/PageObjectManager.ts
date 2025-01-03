import { Page } from "@playwright/test";
import { DatePickerPage } from "./DatePickerPage";
import { LeftSideBarNavigation } from "./LeftSideBarNavigation";
import { FormLayoutsPage } from "./FormLayoutsPage";

export class PageObjectManaer{

    readonly page: Page
    readonly datePickerPage: DatePickerPage
    readonly leftSideBarNavigation: LeftSideBarNavigation
    readonly formLayoutsPage: FormLayoutsPage

    constructor(page: Page){
        this.page = page
        this.datePickerPage = new DatePickerPage(this.page)
        this.leftSideBarNavigation = new LeftSideBarNavigation(this.page)
        this.formLayoutsPage = new FormLayoutsPage(this.page)
    }

    navigateTo(){
        return this.leftSideBarNavigation
    }

    onFormLayoutPage(){
        return this.formLayoutsPage
    }

    onDatePickerPage(){
        return this.datePickerPage
    }

}