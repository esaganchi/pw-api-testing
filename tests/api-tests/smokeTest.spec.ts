import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';
import { expect as customExpect } from '../../utils/customExpect';
import { validateSchema } from '../../utils/schema-validator';
import articleRequestPayload from '../../request-objects/POST-article.json';
import { faker } from '@faker-js/faker';
import { getNewRandomArticle } from '../../utils/data-generator';


test('Get Articles', async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .clearAuth()
        .getRequest(200);
    
    await expect(response).shouldMatchSchema('articles', 'GET_articles');
    customExpect(response.articles.length).shouldEqual(10);
    // Check that articles count matches the number of articles in the array
    customExpect(response.articlesCount).shouldEqual(response.articles.length);

    // Check that all slugs are unique
    const slugs = response.articles.map((article: any) => article.slug);
    customExpect(new Set(slugs).size).shouldEqual(slugs.length);

    // Check that articles are sorted from newest to oldest
    for (let i = 0; i < response.articles.length - 1; i++) {
        expect(new Date(response.articles[i].createdAt).getTime())
            .toBeGreaterThanOrEqual(new Date(response.articles[i + 1].createdAt).getTime());
    }

    // Validate each article
    response.articles.forEach((article: any) => {
        expect(article.slug).toBeTruthy();
        expect(article.title).toBeTruthy();
        expect(article.description).toBeTruthy();
        expect(article.body).toBeTruthy();
        expect(article.author.username).toBeTruthy();
        // Check that slug ends with a number
        expect(article.slug).toMatch(/-\d+$/);
        // Check that slug contains dashes (words are separated by "-")
        expect(article.slug.replace(/-\d+$/, '')).toContain('-');
        expect(article.favoritesCount).toBeGreaterThanOrEqual(0);
        // Check that updated date is not earlier than created date
        expect(new Date(article.updatedAt).getTime())
            .toBeGreaterThanOrEqual(new Date(article.createdAt).getTime());
        expect(Array.isArray(article.tagList)).toBe(true);
    });
});

test('Get Test Tags', async ({ api }) => {
    const response = await api.path('/tags').getRequest(200);
    expect(response).shouldMatchSchema('tags', 'GET_tags');
    expect(response.tags[0]).shouldEqual('Test');
    expect(response.tags.length).shouldBeLessThanOrEqual(10);
});

test('Create and Delete Article', async ({ api }) => {

    const articleRequest = getNewRandomArticle();
    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequest)
        .postRequest(201);
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_article');    
    const slugId = createArticleResponse.article.slug;

    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    await expect(articlesResponse).shouldMatchSchema('articles', 'GET_articles');
    expect(articlesResponse.articles[0].title).shouldEqual(articleRequest.article.title);

    await api.path(`/articles/${slugId}`).deleteRequest(204);

    const articlesResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    await expect(articlesResponseTwo).shouldMatchSchema('articles', 'GET_articles');
    expect(articlesResponseTwo.articles[0].title).not.shouldEqual(articleRequest.article.title);
});

test('Create, Update and Delete Article', async ({ api }) => {
    const articleRequest = getNewRandomArticle();
    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequest)      
        .postRequest(201);
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_article');
    customExpect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title);
    const slug = createArticleResponse.article.slug;

    const updateArticleResponse = await api
        .path(`/articles/${slug}`)
        .body(articleRequest)
        .putRequest(200);
    await expect(updateArticleResponse).shouldMatchSchema('articles', 'PUT_article');
    customExpect(updateArticleResponse.article.title).shouldEqual(articleRequest.article.title);
    const slugUpdated = updateArticleResponse.article.slug;

    const articleResponse = await api.path(`/articles/${slugUpdated}`).getRequest(200);
    await expect(articleResponse).shouldMatchSchema('articles', 'GET_article');
    customExpect(articleResponse.article.title).shouldEqual(articleRequest.article.title);

    await api.path(`/articles/${slugUpdated}`).deleteRequest(204);

    const articleResponseAfter = await api
        .path('/articles/')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    await expect(articleResponseAfter).shouldMatchSchema('articles', 'GET_articles');
    customExpect(articleResponseAfter.articles[0].title).not.shouldEqual(articleRequest.article.title);
});
