import { test, expect } from '@playwright/test';

test('Create, Update and Delete a Article', async ({ request }) => {
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
    const uniqueTitle = `Update Article ${Date.now()}`

    const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', 
        {
        data: {
            article: {
                title: uniqueTitle,
                description: 'Test Update Description Three Saganchi',
                body: 'Test Update Body Three Saganchi',
                tagList: ['Test4', 'Test5', 'Test6']
            }
        },
        headers: {
            'Authorization': authToken
        }
    })
    
    const slugID = (await newArticleResponse.json()).article.slug

    const updatedTitle = `Updated Article ${Date.now()}`
    const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`, {
        data: {
            article: {
                title: updatedTitle,
                description: 'Test Update Description Four Saganchi',
                body: 'Test Update Body Four Saganchi',
                tagList: ['Test7', 'Test8', 'Test9']
            }
        },
        headers: {
            'Authorization': authToken
        }
    })
    expect(updateArticleResponse.status()).toEqual(200)
    const updateArticleResponseJSON = await updateArticleResponse.json()
    expect(updateArticleResponseJSON.article.title).toEqual(updatedTitle)
    
    // Получаем обновленный slug после изменения статьи (slug может измениться при изменении title)
    const updatedSlugID = updateArticleResponseJSON.article.slug
    expect(updatedSlugID).toBeDefined()
    
    const articleResponseGET = await request.get(`https://conduit-api.bondaracademy.com/api/articles/?limit=10&offset=0`,{
        headers: {
            'Authorization': authToken
        }
    })
    const ArticleResponseJSON = await articleResponseGET.json()
    expect(articleResponseGET.status()).toEqual(200)
    expect(ArticleResponseJSON.articles[0].title).toEqual(updatedTitle)

    // Используем обновленный slug для удаления статьи
    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${updatedSlugID}`, {
        headers: {
            'Authorization': authToken
        }
    })
    expect(deleteArticleResponse.status()).toEqual(204)
    
});
