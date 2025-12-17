import { test } from '../utils/fixtures';
import { expect } from '@playwright/test';
import { APILogger } from '../utils/logger';

// Общие переменные для всех тестов
let authToken: string;

test.beforeAll('Authenticate user before all tests', async ({ api }) => {
    const tokenResponse = await api
        .path('/users/login')
        .body({ user: { email: 'saga1993@gmail.com', password: 'saga1993'} })
        .postRequest(200)

    authToken = `Token ${tokenResponse.user.token}`;
});

test('Get Articles', async ({ api }) => {
  const response = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200);

  expect(response.articles.length).toBeLessThanOrEqual(10);
  expect(response.articlesCount).toEqual(10);
});

test('Get Test Tags', async ({ api }) => {
  const response = await api
    .path('/tags')
    .getRequest(200);

  expect(response.tags[0]).toEqual('Test');
  expect(response.tags.length).toBeLessThanOrEqual(10);
});

test('Create and Delete Article', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
        .headers({ 'Authorization': authToken })
        .body({ 
            article: { 
                title: 'Test TWO Test',
                description: 'Test TWO Description', 
                body: 'Test TWO Body',
                tagList: ['Test TWO']
            } 
        })
        .postRequest(201);
    expect(createArticleResponse.article.title).toEqual('Test TWO Test');
    const slug = createArticleResponse.article.slug;

    const articleResponse = await api
        .path('/articles/')
        .headers({ 'Authorization': authToken })
        .params({limit: 10, offset: 0})
        .getRequest(200);
    expect(articleResponse.articles[0].title).toEqual('Test TWO Test');

    await api
        .path(`/articles/${slug}`)
        .headers({ 'Authorization': authToken })
        .deleteRequest(204);

    const articleResponseAfter = await api
        .path('/articles/')
        .headers({ 'Authorization': authToken })
        .params({limit: 10, offset: 0})
        .getRequest(200);
    expect(articleResponseAfter.articles[0].title).not.toEqual('Test TWO Test');
});


test('Create, Update and Delete Article', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
        .headers({ 'Authorization': authToken })
        .body({ 
            article: { 
                title: 'Test Three Test',
                description: 'Test TWO Description', 
                body: 'Test TWO Body',
                tagList: ['Test TWO']
            } 
        })
        .postRequest(201);
    expect(createArticleResponse.article.title).toEqual('Test Three Test');
    const slug = createArticleResponse.article.slug;

    const updateArticleResponse = await api
        .path(`/articles/${slug}`)
        .headers({ 'Authorization': authToken })
        .body({ 
            article: { 
                title: 'Test Three Test Updated',
            } 
        })
        .putRequest(200);
    expect(updateArticleResponse.article.title).toEqual('Test Three Test Updated');
    const slugUpdated = updateArticleResponse.article.slug;

    const articleResponse = await api
        .path('/articles/')
        .headers({ 'Authorization': authToken })
        .params({limit: 10, offset: 0})
        .getRequest(200);
    expect(articleResponse.articles[0].title).toEqual('Test Three Test Updated');

    await api
        .path(`/articles/${slugUpdated}`)
        .headers({ 'Authorization': authToken })
        .deleteRequest(204);

    const articleResponseAfter = await api
        .path('/articles/')
        .headers({ 'Authorization': authToken })
        .params({limit: 10, offset: 0})
        .getRequest(200);
    expect(articleResponseAfter.articles[0].title).not.toEqual('Test Three Test Updated');
});



