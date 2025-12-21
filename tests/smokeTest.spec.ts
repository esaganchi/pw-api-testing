import { test } from '../utils/fixtures';
import { expect } from '@playwright/test';
import { expect as customExpect } from '../utils/customExpect';
import { validateSchema } from '../utils/schema-validator';
import articleRequestPayload from '../request-objects/POST-article.json';
import { faker } from '@faker-js/faker';
import { getNewRandomArticle } from '../utils/data-generator';


test('Get Articles', async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .clearAuth()
        .getRequest(200);
    await expect(response).shouldMatchSchema('articles', 'GET_articles');
    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    customExpect(response.articles.length).shouldEqual(10);
});

test('Get Test Tags', async ({ api }) => {
    const response = await api.path('/tags').getRequest(200);
    expect(response).shouldMatchSchema('tags', 'GET_tags');
    expect(response.tags[0]).shouldEqual('Test');
    //expect(response.tags[0]).shouldEqual('test, automation');
    expect(response.tags.length).shouldBeLessThanOrEqual(10);
});

test('Create and Delete Article', async ({ api }) => {
    // const articleTitle = faker.lorem.sentence(5);
    // const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload));
    //articleRequest.article.title = articleTitle;
    const articleRequest = getNewRandomArticle();
    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequest)
        .postRequest(201);
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_article');    
    const slugId = createArticleResponse.article.slug;

    //const articleTitleTwo = faker.lorem.sentence(5);
    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articlesResponse.articles[0].title).shouldEqual(articleRequest.article.title);

    await api.path(`/articles/${slugId}`).deleteRequest(204);

    const articlesResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articlesResponseTwo.articles[0].title).not.shouldEqual(articleRequest.article.title);
});

test('Create, Update and Delete Article', async ({ api }) => {
    // const articleTitle = faker.lorem.sentence(5);
    // const updatedTitle = faker.lorem.sentence(5);  
    const articleRequest = getNewRandomArticle();
    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequest)      
        .postRequest(201);
    customExpect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title);
    const slug = createArticleResponse.article.slug;

    const updateArticleResponse = await api
        .path(`/articles/${slug}`)
        .body(articleRequest)
        .putRequest(200);
    customExpect(updateArticleResponse.article.title).shouldEqual(articleRequest.article.title);
    const slugUpdated = updateArticleResponse.article.slug;

    // Получаем конкретную статью по slug вместо списка, чтобы избежать проблем с параллельными тестами
    const articleResponse = await api.path(`/articles/${slugUpdated}`).getRequest(200);
    customExpect(articleResponse.article.title).shouldEqual(articleRequest.article.title);

    await api.path(`/articles/${slugUpdated}`).deleteRequest(204);

    const articleResponseAfter = await api
        .path('/articles/')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    customExpect(articleResponseAfter.articles[0].title).not.shouldEqual(articleRequest.article.title);
});
