/**
 * API Configuration
 * Centralized configuration for all API endpoints and base URLs
 */

export const API_CONFIG = {
    BASE_URL: 'https://conduit-api.bondaracademy.com/api',

    ENDPOINTS: {
        LOGIN: '/users/login',
        ARTICLES: '/articles',
        TAGS: '/tags',
    },
} as const;

/**
 * Helper function to build full API URL
 */
export const getApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Pre-built API URLs for convenience
 */
export const API_URLS = {
    LOGIN: getApiUrl(API_CONFIG.ENDPOINTS.LOGIN),
    ARTICLES: getApiUrl(API_CONFIG.ENDPOINTS.ARTICLES),
    TAGS: getApiUrl(API_CONFIG.ENDPOINTS.TAGS),
} as const;
