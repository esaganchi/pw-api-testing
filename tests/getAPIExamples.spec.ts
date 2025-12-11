import { test, expect } from '@playwright/test';

test('Get Test Tags', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseJSON = await tagsResponse.json()

  expect(tagsResponse.status()).toBe(200)
  expect(tagsResponseJSON.tags[0]).toBe('Test')
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10)

  console.log(tagsResponseJSON)
});



test('Get all Articles', async ({ request }) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  const articlesResponseJSON = await articlesResponse.json()

  expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10)
  expect(articlesResponseJSON.articlesCount).toEqual(10)
  expect(articlesResponse.status()).toBe(200)  

  console.log(articlesResponseJSON)
});