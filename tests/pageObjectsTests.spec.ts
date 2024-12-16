import {test} from '../PageObjects/BasePage.ts'
import { LeftSideBarNavigation } from '../PageObjects/LeftSideBarNavigation'
import { FormLayoutsPage } from '../PageObjects/FormLayoutsPage';

test.beforeEach( async({page})=>{
    await page.goto('http://localhost:4200/');
    await page.locator('(//*[contains(@class,"nb-transition")]/button)[1]').click();
    await page.locator('#nb-option-7').click();
})

test('navigation to form layout test', async({page})=>{
    const navigation = new LeftSideBarNavigation(page)
    await navigation.navigateToFormLayout()
    await navigation.navigateToDatePicker() 
    await navigation.navigateToSmartTable()
    await navigation.navigateToTooltip()
    await navigation.navigateToToastr()
})

/**
 * Using page object model by initializing the classes inside the tests
 */
test('Login to the basic form', async({page})=>{
    const navigation = new LeftSideBarNavigation(page)
    await navigation.navigateToFormLayout()

    const formLayout = new FormLayoutsPage(page)
    await formLayout.enterUserNameAndPasswordToSubmit('test3@example.com','password123')
})

/**
 * Using custom fixture for using the page object model
 */
test('Login to the basic form using custom fixture', async({sideBarNavigation, formLayoutPage})=>{
    await sideBarNavigation.navigateToFormLayout()
    await formLayoutPage.enterUserNameAndPasswordToSubmit('test3@example.com','password123')
})