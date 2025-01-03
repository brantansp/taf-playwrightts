import { test as base } from "@playwright/test";
import { LeftSideBarNavigation } from "./LeftSideBarNavigation";
import { FormLayoutsPage } from "./FormLayoutsPage";

type MyFixture = {
    sideBarNavigation : LeftSideBarNavigation
    formLayoutPage: FormLayoutsPage
}

export const test = base.extend<MyFixture>({
    sideBarNavigation: async({page}, use)=>{
        await use(new LeftSideBarNavigation(page))
    },
    formLayoutPage: async({page}, use)=> {
        await use(new FormLayoutsPage(page))
    }
})

export {expect} from '@playwright/test'