import articleRequestPayload from '../request-objects/POST-article.json';
import { faker } from '@faker-js/faker';

export function getNewRandomArticle() {
    const articleRequest = structuredClone(articleRequestPayload);
    articleRequest.article.title = faker.lorem.sentence(5);
    articleRequest.article.description = faker.lorem.sentence(10);
    articleRequest.article.body = faker.lorem.paragraph(10);
    articleRequest.article.tagList = [faker.lorem.word(10)];
    return articleRequest;
}