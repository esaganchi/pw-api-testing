# Configuration Files

This directory contains centralized configuration files for the Playwright test suite.

## Structure

### `api.config.ts`
Contains all API-related configuration:
- Base URLs
- API endpoints
- Helper functions for building API URLs

**Usage:**
```typescript
import { API_URLS, API_CONFIG } from '../config';

// Use pre-built URLs
await request.get(API_URLS.ARTICLES);

// Or build custom URLs
const customUrl = getApiUrl('/custom/endpoint');
```

### `test-data.config.ts`
Contains test data including:
- Test user credentials
- Sample article data
- Helper functions for generating test data

**Usage:**
```typescript
import { TEST_USERS, TEST_ARTICLE_DATA, generateUniqueArticleTitle } from '../config';

// Use test users
const user = TEST_USERS.DEFAULT;

// Use test article data
const article = TEST_ARTICLE_DATA.DEFAULT;

// Generate unique titles
const uniqueTitle = generateUniqueArticleTitle('My Article');
```

### `index.ts`
Central export point for all configuration files. Import everything from here:
```typescript
import { API_URLS, TEST_USERS, TEST_ARTICLE_DATA } from '../config';
```

## Best Practices

1. **Never hardcode URLs or credentials** - Always use config files
2. **Use constants** - All config values should be `as const` for type safety
3. **Centralize changes** - Update config files instead of individual test files
4. **Document additions** - Add JSDoc comments for new config values
