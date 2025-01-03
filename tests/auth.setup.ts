import {test as setup} from '@playwright/test';
import user from '../.auth/user.json'
import fs, { access } from 'fs'

const authFile = '.auth/user.json'

setup('authentication', async({ request})=>{
    // This is UI way of getting the authentication

    //await page.goto('https://conduit.bondaracademy.com/login')
    //await page.getByRole('textbox',{name: 'Email'}).fill('brantan@gmail.com')
    //await page.getByRole('textbox',{name: 'Password'}).fill('test@1234')
    //await page.getByRole('button').click()
    //await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')
    //await page.context().storageState({path: authFile})

    // This is API way of getting the authentication

    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login',{
        data: {
            "user":{"email":"brantan@gmail.com","password":"test@1234"}
        }
    })

    const responseBody = await response.json()
    const token = responseBody.user.token

    user.origins[0].localStorage[0].value= token
    fs.writeFileSync(authFile, JSON.stringify(user))

    // Set the commonly used variables to env

    process.env['ACCESS_TOKEN'] = token
})