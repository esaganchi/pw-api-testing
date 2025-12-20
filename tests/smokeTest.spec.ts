import { test } from '../utils/fixtures';
import { expect } from '@playwright/test';
import { expect as customExpect } from '../utils/customExpect';
import { validateSchema } from '../utils/schema-validator';

test('Get Articles', async ({ api }) => {
  const response = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .clearAuth()
    .getRequest(200);  
  expect(response.articles.length).shouldBeLessThanOrEqual(10);
  customExpect(response.articles.length).shouldEqual(10);
});

test('Get Test Tags', async ({ api }) => {
    const response = await api
      .path('/tags')
      .getRequest(200);
    await validateSchema('tags', 'GET_tags', response);
  
    expect(response.tags[0]).shouldEqual('test, automation');
    expect(response.tags.length).shouldBeLessThanOrEqual(10);
  });
  

test('Create and Delete Article', async ({ api }) => {
    const uniqueTitle = `Test TWO Test ${Date.now()}`;
    const createArticleResponse = await api
        .path('/articles')
        .body({ 
            article: { 
                title: uniqueTitle,
                description: 'Test TWO Description', 
                body: 'Test TWO Body',
                tagList: ['Test TWO']
            } 
        })
        .postRequest(201);
    customExpect(createArticleResponse.article.title).shouldEqual(uniqueTitle);
    const slug = createArticleResponse.article.slug;

    // Получаем конкретную статью по slug вместо списка, чтобы избежать проблем с параллельными тестами
    const articleResponse = await api
        .path(`/articles/${slug}`)
        .getRequest(200);
    customExpect(articleResponse.article.title).shouldEqual(uniqueTitle);

    await api
        .path(`/articles/${slug}`)
        .deleteRequest(204);

    const articleResponseAfter = await api
        .path('/articles/')
        .params({limit: 10, offset: 0})
        .getRequest(200);
    customExpect(articleResponseAfter.articles[0].title).not.shouldEqual(uniqueTitle);
});


test('Create, Update and Delete Article', async ({ api }) => {
    const uniqueTitle = `Test Three Test ${Date.now()}`;
    const updatedTitle = `Test Three Test Updated ${Date.now()}`;
    const createArticleResponse = await api
        .path('/articles')
        .body({ 
            article: { 
                title: uniqueTitle,
                description: 'Test TWO Description', 
                body: 'Test TWO Body',
                tagList: ['Test TWO']
            } 
        })
        .postRequest(201);
    customExpect(createArticleResponse.article.title).shouldEqual(uniqueTitle);
    const slug = createArticleResponse.article.slug;

    const updateArticleResponse = await api
        .path(`/articles/${slug}`)
        .body({ 
            article: { 
                title: updatedTitle,
            } 
        })
        .putRequest(200);
    customExpect(updateArticleResponse.article.title).shouldEqual(updatedTitle);
    const slugUpdated = updateArticleResponse.article.slug;

    // Получаем конкретную статью по slug вместо списка, чтобы избежать проблем с параллельными тестами
    const articleResponse = await api
        .path(`/articles/${slugUpdated}`)
        .getRequest(200);
    customExpect(articleResponse.article.title).shouldEqual(updatedTitle);

    await api
        .path(`/articles/${slugUpdated}`)
        .deleteRequest(204);

    const articleResponseAfter = await api
        .path('/articles/')
        .params({limit: 10, offset: 0})
        .getRequest(200);
    customExpect(articleResponseAfter.articles[0].title).not.shouldEqual(updatedTitle);
});



