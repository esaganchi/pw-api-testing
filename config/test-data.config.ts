/**
 * Test Data Configuration
 * Centralized test data including credentials, test users, and sample data
 */

export const TEST_USERS = {
    DEFAULT: {
        email: 'saga1993@gmail.com',
        password: 'saga1993',
    },
} as const;

export const TEST_ARTICLE_DATA = {
    DEFAULT: {
        title: 'Article Three',
        description: 'Test Description Three Saganchi',
        body: 'Test Body Three Saganchi',
        tagList: ['Test4', 'Test5', 'Test6'],
    },
} as const;

/**
 * Helper function to generate unique article title
 */
export const generateUniqueArticleTitle = (baseTitle: string = 'Article Three'): string => {
    return `${baseTitle} ${Date.now()}`;
};
