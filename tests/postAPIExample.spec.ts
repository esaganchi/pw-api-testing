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
    
    // Проверяем статус ответа логина
    expect(tokenResponse.status()).toBe(200)
    const tokenResponseJSON = await tokenResponse.json()
    // Проверяем, что ответ содержит user и token
    expect(tokenResponseJSON.user).toBeDefined()
    expect(tokenResponseJSON.user.token).toBeDefined()
    
    const authToken = 'Token ' + tokenResponseJSON.user.token
    //const uniqueTitle = `Test Article Saganchi ${Date.now()}`
    const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
        
        data: {
            article: {
                title: 'Article Three',
                description: 'Test Description Three Saganchi',
                body: 'Test Body Three Saganchi',
                tagList: ['Test4', 'Test5', 'Test6']
            }
        },
        headers: {
            'Authorization': authToken
        }
    })
    
    // Проверяем статус ответа создания статьи
    // expect(newArticleResponse.status()).toBe(201)
    // const newArticleResponseJSON = await newArticleResponse.json()
    // console.log(newArticleResponseJSON)
    // // Проверяем, что ответ содержит article
    // expect(newArticleResponseJSON.article).toBeDefined()
    // expect(newArticleResponseJSON.article.title).toEqual('Article Three')

    const articleResponseGET = await request.get(`https://conduit-api.bondaracademy.com/api/articles/?limit=10&offset=0`,{
        headers: {
            'Authorization': authToken
        }
    })
    const ArticleResponseJSON = await articleResponseGET.json()
    expect(articleResponseGET.status()).toEqual(200)
    expect(ArticleResponseJSON.articles[0].title).toEqual('Article Three')
});