import {expect, test, request} from '@playwright/test'
import tags from '../test-data/tags.json'

test.beforeEach(async({page})=>{
    // This can mock the response directly
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })

    // This can receive the response and modify it
     await page.route('*/**/api/articles*', async route => {
         const response = await route.fetch()
         const responseBody = await response.json()
         responseBody.articles[1].title="mock article"

         await route.fulfill({
             body: JSON.stringify(responseBody)
         })
     })

    await page.goto('https://conduit.bondaracademy.com')
})

test('First Api test', async({page, request})=>{
    await expect(page.locator('.navbar-brand')).toHaveText("conduit");
    await page.waitForTimeout(5000)

    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login',{
        data: {
            "user":{"email":"brantan@gmail.com","password":"test@1234"}
        }
    })

    const responseBody = await response.json()
    const token = responseBody.user.token
    
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data:{
            "article":{"title":"mock article","description":"mocking api request","body":"mocking api request body","tagList":[]}
        },
        headers:{
            Authorization: `Token ${token}`
        }
    })

    expect(articleResponse.status()).toEqual(201)
    await page.waitForTimeout(5000)
    await page.evaluate(token => localStorage.setItem('jwtToken', token), token)
    await page.reload()
    await page.getByText('mock article').click()
    await page.locator('.btn-outline-danger').first().click()
    await page.waitForTimeout(5000)
})

test('Creating new article and deleting it', async({page, request})=>{
    await expect(page.locator('.navbar-brand')).toHaveText("conduit");
    await page.waitForTimeout(5000)

    // This code of API login in script is not required as login is done via setup

    //const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login',{
    //    data: {
    //        "user":{"email":"brantan@gmail.com","password":"test@1234"}
    //    }
    //})

    //const responseBody = await response.json()
    //const token = responseBody.user.token
    //await page.evaluate(token => localStorage.setItem('jwtToken', token), token)

    await page.reload()

    await page.getByText('New Article').click()
    await page.getByRole('textbox', {name:'Article Title'}).fill('Playwright is awesome')
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('About playwright')
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('We like to use playwright for automation')

    await page.getByRole('button', {name: 'Publish Article'}).click()
    const articleCreationResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const articleResponse = await articleCreationResponse.json()
    const slugId = articleResponse.article.slug

    await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome')
    await page.getByText('Home').click()
    await page.getByText('Global Feed').click()
    await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome')

    // Adding authorization is not required since we added this in playwright.config.ts as extraHTTPHeaders

    //const deleteArticle = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`,{
    //    headers:{
    //        Authorization: `Token ${token}`
    //    }
    //})
    
    const deleteArticle = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`)

    expect(deleteArticle.status()).toEqual(204)
})

/**
 * This is a shared state auth example
 * 1. create a folder .auth
 * 2. create auth.setup.ts
 * 3. add this to projects in playwright.config.ts
 * 4. for other projects like chromium, firefox, etc add this a depencency
 * 5. also add the storage state to the use section of projects
 */
test('Shared state auth', async({page})=>{
    await expect(page.locator('.navbar-brand')).toHaveText("conduit");

    await page.getByText('New Article').click()
    await page.getByRole('textbox', {name:'Article Title'}).fill('Playwright is awesome')
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('About playwright')
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('We like to use playwright for automation')
})