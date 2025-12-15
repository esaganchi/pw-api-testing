// import { test, expect } from '@playwright/test';
// import { API_URLS } from '../config';
// import { TEST_USERS, TEST_ARTICLE_DATA } from '../config';

// test.describe.skip('Article Creation and Retrieval', () => {
//     test('should create a new article and verify it in the articles list', async ({ request }) => {
//         // ============================================
//         // ШАГ 1: Аутентификация пользователя
//         // ============================================
//         const loginResponse = await request.post(API_URLS.LOGIN, {
//             data: {
//                 user: {
//                     email: TEST_USERS.DEFAULT.email,
//                     password: TEST_USERS.DEFAULT.password,
//                 },
//             },
//         });

//         expect(loginResponse.status()).toBe(200);

//         const loginResponseJson = await loginResponse.json();
//         expect(loginResponseJson.user).toBeDefined();
//         expect(loginResponseJson.user.token).toBeDefined();

//         const authToken = `Token ${loginResponseJson.user.token}`;

//         // ============================================
//         // ШАГ 2: Создание новой статьи
//         // ============================================
//         const articleData = TEST_ARTICLE_DATA.DEFAULT;

//         const createArticleResponse = await request.post(API_URLS.ARTICLES, {
//             data: {
//                 article: articleData,
//             },
//             headers: {
//                 Authorization: authToken,
//             },
//         });

//         const createStatus = createArticleResponse.status();
//         const createArticleJson = await createArticleResponse.json();

//         if (createStatus !== 201) {
//             console.error('Failed to create article. Response:', createArticleJson);
//         }

//         expect(createStatus).toBe(201);
//         expect(createArticleJson.article).toBeDefined();
//         expect(createArticleJson.article.title).toBe(articleData.title);

//         // ============================================
//         // ШАГ 3: Проверка создания статьи через GET запрос
//         // ============================================
//         const getArticlesResponse = await request.get(`${API_URLS.ARTICLES}/?limit=10&offset=0`, {
//             headers: {
//                 Authorization: authToken,
//             },
//         });

//         expect(getArticlesResponse.status()).toBe(200);

//         const articlesJson = await getArticlesResponse.json();
//         expect(articlesJson.articles).toBeDefined();
//         expect(articlesJson.articles.length).toBeGreaterThan(0);
//         expect(articlesJson.articles[0].title).toBe(articleData.title);
//     });
// });
