import { test } from '../utils/fixtures';
import { expect } from '@playwright/test';
import { APILogger } from '../utils/logger';
import { expect as customExpect } from '../utils/customExpect';

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

  expect(response.articles.length).shouldBeLessThanOrEqual(10);
  customExpect(response.articlesCount).shouldEqual(10);
});

test('Get Test Tags', async ({ api }) => {
  const response = await api
    .path('/tags')
    .getRequest(200);

  expect(response.tags[0]).toEqual('Test');
  expect(response.tags.length).shouldBeLessThanOrEqual(10);
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
    customExpect(createArticleResponse.article.title).shouldEqual('Test TWO Test');
    const slug = createArticleResponse.article.slug;

    const articleResponse = await api
        .path('/articles/')
        .headers({ 'Authorization': authToken })
        .params({limit: 10, offset: 0})
        .getRequest(200);
    customExpect(articleResponse.articles[0].title).shouldEqual('Test TWO Test');

    await api
        .path(`/articles/${slug}`)
        .headers({ 'Authorization': authToken })
        .deleteRequest(204);

    const articleResponseAfter = await api
        .path('/articles/')
        .headers({ 'Authorization': authToken })
        .params({limit: 10, offset: 0})
        .getRequest(200);
    customExpect(articleResponseAfter.articles[0].title).not.shouldEqual('Test TWO Test');
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
    customExpect(createArticleResponse.article.title).shouldEqual('Test Three Test');
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
    customExpect(updateArticleResponse.article.title).shouldEqual('Test Three Test Updated');
    const slugUpdated = updateArticleResponse.article.slug;

    const articleResponse = await api
        .path('/articles/')
        .headers({ 'Authorization': authToken })
        .params({limit: 10, offset: 0})
        .getRequest(200);
    customExpect(articleResponse.articles[0].title).shouldEqual('Test Three Test Updated');

    await api
        .path(`/articles/${slugUpdated}`)
        .headers({ 'Authorization': authToken })
        .deleteRequest(204);

    const articleResponseAfter = await api
        .path('/articles/')
        .headers({ 'Authorization': authToken })
        .params({limit: 10, offset: 0})
        .getRequest(200);
    customExpect(articleResponseAfter.articles[0].title).not.shouldEqual('Test Three Test Updated');
});



