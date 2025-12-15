// import { test, expect } from '@playwright/test';
// import { API_URLS } from '../config';

// test.describe.skip('API GET Requests', () => {
//     test('should retrieve tags and verify response structure', async ({ request }) => {
//         // ============================================
//         // ШАГ 1: Получение списка тегов
//         // ============================================
//         const tagsResponse = await request.get(API_URLS.TAGS);

//         expect(tagsResponse.status()).toBe(200);

//         // ============================================
//         // ШАГ 2: Проверка структуры и содержимого ответа
//         // ============================================
//         const tagsResponseJson = await tagsResponse.json();

//         expect(tagsResponseJson.tags).toBeDefined();
//         expect(Array.isArray(tagsResponseJson.tags)).toBe(true);
//         expect(tagsResponseJson.tags.length).toBeGreaterThan(0);
//         expect(tagsResponseJson.tags[0]).toBe('Test');
//         expect(tagsResponseJson.tags.length).toBeLessThanOrEqual(10);
//     });

//     test('should retrieve articles list with pagination', async ({ request }) => {
//         // ============================================
//         // ШАГ 1: Получение списка статей с пагинацией
//         // ============================================
//         const limit = 10;
//         const offset = 0;
//         const articlesResponse = await request.get(
//             `${API_URLS.ARTICLES}?limit=${limit}&offset=${offset}`
//         );

//         expect(articlesResponse.status()).toBe(200);

//         // ============================================
//         // ШАГ 2: Проверка структуры и содержимого ответа
//         // ============================================
//         const articlesResponseJson = await articlesResponse.json();

//         expect(articlesResponseJson.articles).toBeDefined();
//         expect(Array.isArray(articlesResponseJson.articles)).toBe(true);
//         expect(articlesResponseJson.articles.length).toBeLessThanOrEqual(limit);
//         expect(articlesResponseJson.articlesCount).toBe(limit);
//     });
// });
