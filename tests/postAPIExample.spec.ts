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
    const authToken = tokenResponseJSON.user.token
    console.log(authToken)




//   const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
//   const tagsResponseJSON = await tagsResponse.json()

//   expect(tagsResponse.status()).toBe(200)
//   expect(tagsResponseJSON.tags[0]).toBe('Test')
//   expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10)

//   console.log(tagsResponseJSON)
});