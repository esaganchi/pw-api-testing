import { test, expect } from '@playwright/test';

test('Create a new Article', async ({ request }) => {
    const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            user: {
                email: 'saga1993@gmail.com',
                password: 'saga1993'
            }
        }
    })
    const tokenResponseJSON = await tokenResponse.json()
    const authToken = 'Token ' + tokenResponseJSON.user.token

    const uniqueTitle = `Test Article Saganchi ${Date.now()}`
    const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
        data: {
            article: {
                title: uniqueTitle,
                description: 'Test Description Saganchi',
                body: 'Test Body Saganchi',
                tagList: ['Test', 'Test2', 'Test3']
            }
        },
        headers: {
            'Authorization': authToken
        }
    })
    const newArticleResponseJSON = await newArticleResponse.json()
    expect(newArticleResponse.status()).toBe(201)

});