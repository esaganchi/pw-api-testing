// import { test, expect } from '@playwright/test';
// import { API_URLS } from '../config';
// import { TEST_USERS } from '../config';

// // Общие переменные для всех тестов
// let authToken: string;

// test.beforeAll('Authenticate user before all tests', async ({ request }) => {
//     const tokenResponse = await request.post(API_URLS.LOGIN, {
//         data: {
//             user: {
//                 email: TEST_USERS.DEFAULT.email,
//                 password: TEST_USERS.DEFAULT.password,
//             },
//         },
//     });

//     // Проверяем статус ответа логина
//     expect(tokenResponse.status()).toBe(200);
//     const tokenResponseJSON = await tokenResponse.json();

//     // Проверяем, что ответ содержит user и token
//     expect(tokenResponseJSON.user).toBeDefined();
//     expect(tokenResponseJSON.user.token).toBeDefined();

//     authToken = `Token ${tokenResponseJSON.user.token}`;
// });

// test.beforeEach('run before each tests', async ({}) => {
//     console.log('run before each tests');
// });

// test.afterEach('run after all tests', async ({}) => {
//     console.log('run after all tests');
// });

// test('Get Test Tags', async ({ request }) => {
//     const tagsResponse = await request.get(API_URLS.TAGS);
//     const tagsResponseJSON = await tagsResponse.json();

//     expect(tagsResponse.status()).toEqual(200);
//     expect(tagsResponseJSON.tags[0]).toEqual('Test');
//     expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10);
// });

// test('Get All Articles', async ({ request }) => {
//     const articlesResponse = await request.get(`${API_URLS.ARTICLES}?limit=10&offset=0`);
//     const articlesResponseJSON = await articlesResponse.json();

//     expect(articlesResponse.status()).toEqual(200);
//     expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10);
//     expect(articlesResponseJSON.articlesCount).toEqual(10);
// });


// test.describe('Article Management with Authentication', () => {
//     test('Create and Delete a Article', async ({ request }) => {
//         const uniqueTitle = `Article Three ${Date.now()}`;

//         const newArticleResponse = await request.post(API_URLS.ARTICLES, 
//             {
//                 data: {
//                     article: {
//                         title: uniqueTitle,
//                         description: 'Test Description Three Saganchi',
//                         body: 'Test Body Three Saganchi',
//                         tagList: ['Test4', 'Test5', 'Test6'],
//                     },
//                 },
//                 headers: {
//                     Authorization: authToken,
//                 },
//             }
//         );

//         const slugID = (await newArticleResponse.json()).article.slug;

//         const articleResponseGET = await request.get(`${API_URLS.ARTICLES}/?limit=10&offset=0`, {
//             headers: {
//                 Authorization: authToken,
//             },
//         });
//         const ArticleResponseJSON = await articleResponseGET.json();
//         expect(articleResponseGET.status()).toEqual(200);
//         expect(ArticleResponseJSON.articles[0].title).toEqual(uniqueTitle);

//         const deleteArticleResponse = await request.delete(`${API_URLS.ARTICLES}/${slugID}`, {
//             headers: {
//                 Authorization: authToken,
//             },
//         });
//         expect(deleteArticleResponse.status()).toEqual(204);
//     });

//     test('Create, Update and Delete a Article', async ({ request }) => {
//         const uniqueTitle = `Update Article ${Date.now()}`;

//         const newArticleResponse = await request.post(API_URLS.ARTICLES, 
//             {
//                 data: {
//                     article: {
//                         title: uniqueTitle,
//                         description: 'Test Update Description Three Saganchi',
//                         body: 'Test Update Body Three Saganchi',
//                         tagList: ['Test4', 'Test5', 'Test6'],
//                     },
//                 },
//                 headers: {
//                     Authorization: authToken,
//                 },
//             }
//         );

//         const slugID = (await newArticleResponse.json()).article.slug;

//         const updatedTitle = `Updated Article ${Date.now()}`;
//         const updateArticleResponse = await request.put(`${API_URLS.ARTICLES}/${slugID}`, {
//             data: {
//                 article: {
//                     title: updatedTitle,
//                     description: 'Test Update Description Four Saganchi',
//                     body: 'Test Update Body Four Saganchi',
//                     tagList: ['Test7', 'Test8', 'Test9'],
//                 },
//             },
//             headers: {
//                 Authorization: authToken,
//             },
//         });
//         expect(updateArticleResponse.status()).toEqual(200);
//         const updateArticleResponseJSON = await updateArticleResponse.json();
//         expect(updateArticleResponseJSON.article.title).toEqual(updatedTitle);

//         // Получаем обновленный slug после изменения статьи (slug может измениться при изменении title)
//         const updatedSlugID = updateArticleResponseJSON.article.slug;
//         expect(updatedSlugID).toBeDefined();

//         const articleResponseGET = await request.get(`${API_URLS.ARTICLES}/?limit=10&offset=0`, {
//             headers: {
//                 Authorization: authToken,
//             },
//         });
//         const ArticleResponseJSON = await articleResponseGET.json();
//         expect(articleResponseGET.status()).toEqual(200);
//         expect(ArticleResponseJSON.articles[0].title).toEqual(updatedTitle);

//         // Используем обновленный slug для удаления статьи
//         const deleteArticleResponse = await request.delete(`${API_URLS.ARTICLES}/${updatedSlugID}`, {
//             headers: {
//                 Authorization: authToken,
//             },
//         });
//         expect(deleteArticleResponse.status()).toEqual(204);
//     });
// });
