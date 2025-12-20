import { test } from '../utils/fixtures';
import { expect } from '@playwright/test';
import { expect as customExpect } from '../utils/customExpect';

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
    .clearAuth()
    .getRequest(200);

  expect(response.tags[0]).toEqual('Test');
  expect(response.tags.length).shouldBeLessThanOrEqual(10);
});

test('Create and Delete Article', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
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
        .params({limit: 10, offset: 0})
        .getRequest(200);
    customExpect(articleResponse.articles[0].title).shouldEqual('Test TWO Test');

    await api
        .path(`/articles/${slug}`)
        .deleteRequest(204);

    const articleResponseAfter = await api
        .path('/articles/')
        .params({limit: 10, offset: 0})
        .getRequest(200);
    customExpect(articleResponseAfter.articles[0].title).not.shouldEqual('Test TWO Test');
});


test('Create, Update and Delete Article', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
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
        .params({limit: 10, offset: 0})
        .getRequest(200);
    customExpect(articleResponse.articles[0].title).shouldEqual('Test Three Test Updated');

    await api
        .path(`/articles/${slugUpdated}`)
        .deleteRequest(204);

    const articleResponseAfter = await api
        .path('/articles/')
        .params({limit: 10, offset: 0})
        .getRequest(200);
    customExpect(articleResponseAfter.articles[0].title).not.shouldEqual('Test Three Test Updated');
});



