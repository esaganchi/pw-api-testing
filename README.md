# Playwright API and UI Testing Framework

Automated testing project for API and user interface of Conduit application (Bondar Academy) using Playwright and TypeScript.

## Project Description

This project contains automated tests to check API and UI functionality of a web application. The project supports testing REST API endpoints and user interface through browser automation.

## Project Structure

```
pw-api-testing/
├── config/                  # Configuration files
│   ├── api.config.ts       # API endpoints configuration
│   ├── test-data.config.ts # Test data and credentials
│   └── index.ts            # Centralized configuration exports
├── helpers/                 # Helper functions
│   └── createToken.ts      # Authentication token creation
├── request-objects/         # JSON objects for API requests
│   └── POST-article.json   # Request template for article creation
├── response-schemas/        # JSON schemas for API response validation
│   ├── articles/           # Schemas for articles
│   └── tags/               # Schemas for tags
├── tests/                   # Test files
│   ├── api-tests/          # API tests
│   │   ├── smokeTest.spec.ts
│   │   ├── negativeTests.spec.ts
│   │   └── example.spec.ts
│   ├── ui-tests/           # UI tests
│   │   └── smokeUITests.spec.ts
│   └── archive/            # Archive of old tests
├── utils/                   # Test utilities
│   ├── fixtures.ts         # Playwright fixtures with custom options
│   ├── request-handler.ts  # HTTP request handler
│   ├── customExpect.ts     # Custom assertions
│   ├── schema-validator.ts # JSON schema validator
│   ├── logger.ts           # Logger for API requests
│   └── data-generator.ts   # Test data generator
├── api-test.config.ts      # Main project configuration
├── playwright.config.ts    # Playwright configuration
└── package.json            # Project dependencies
```

## Installation and Setup

### Requirements

- Node.js (LTS version)
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Install Playwright Browsers

```bash
npx playwright install --with-deps
```

### Environment Variables Setup

Create a `.env` file in the project root (if you need to override default values):

```env
USER_EMAIL=your_email@example.com
USER_PASSWORD=your_password
TEST_ENV=prod
```

Environment variables are used only for `prod` environment. For other environments, values from `api-test.config.ts` are used.

## Configuration

### Main Configuration

The `api-test.config.ts` file contains the main project configuration:

- **API URL**: `https://conduit-api.bondaracademy.com/api`
- **UI URL**: `https://conduit.bondaracademy.com`
- **Credentials**: depend on environment (prod/qa/default)

### Environments

The project supports several environments, defined by `TEST_ENV` variable:

- **default**: uses default values from configuration
- **qa**: uses QA environment values from configuration
- **prod**: from environment variables or default values from configuration

### Playwright Configuration

The `playwright.config.ts` file defines:

- **Test Projects**: separation into `smoke-tests`, `api-testing`, `ui-tests`
- **Trace**: enabled for all tests
- **Screenshots**: created when tests fail
- **Video**: recorded when tests fail

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Specific Project

```bash
# Only smoke tests
npx playwright test --project=smoke-tests

# Only API tests
npx playwright test --project=api-testing

# Only UI tests
npx playwright test --project=ui-tests
```

### Run Specific File

```bash
npx playwright test tests/api-tests/smokeTest.spec.ts
```

### Run in UI Mode

```bash
npx playwright test --ui
```

### Run with Debugging

```bash
npx playwright test --debug
```

## Viewing Reports

### HTML Report

```bash
npx playwright show-report
```

### View Trace

```bash
npx playwright show-trace path/to/trace.zip
```

## Test Types

### API Tests

API tests use a custom fixture `api` from `utils/fixtures.ts`, which provides:

- **RequestHandler**: wrapper for HTTP requests with automatic authentication
- **Automatic Token**: token is created automatically before running tests
- **Logging**: all API requests are logged

Example usage:

```typescript
import { test } from '../utils/fixtures';

test('Get Articles', async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .clearAuth()
        .getRequest(200);
});
```

### UI Tests

UI tests use standard Playwright fixtures (`page`, `request`) and work with the browser:

```typescript
import { test, expect } from '@playwright/test';
import { config } from '../../api-test.config';

test('create article', async ({ page }) => {
    await page.goto('/');
    // ... UI interaction
});
```

## Main Components

### RequestHandler

Class in `utils/request-handler.ts` to simplify working with API requests:

- Methods: `getRequest()`, `postRequest()`, `putRequest()`, `deleteRequest()`
- Method chains: `.path()`, `.body()`, `.params()`, `.clearAuth()`
- Automatic response handling

### Schema Validator

API response validation using JSON schemas from `response-schemas/`:

```typescript
await expect(response).shouldMatchSchema('articles', 'GET_articles');
```

### Custom Expectations

Custom assertions in `utils/customExpect.ts`:

- `shouldEqual()`: comparison with logging
- `shouldMatchSchema()`: schema validation

### Logger

Logging API requests and responses through `utils/logger.ts`.

## Credentials

Credentials are stored in the following places:

1. **api-test.config.ts**: main credentials for different environments
2. **config/test-data.config.ts**: additional test data
3. **.env file**: environment variables for prod (USER_EMAIL, USER_PASSWORD)

For prod environment, credentials are taken from environment variables (USER_EMAIL, USER_PASSWORD) or default values specified in `api-test.config.ts` are used.

## Code Formatting

Check formatting:

```bash
npm run format:check
```

Auto format:

```bash
npm run format
```

## Test Project Structure

### smoke-tests

Basic tests to check main functionality:
- Pattern: `**/{smoke,negative}*.spec.ts`
- Excludes: `**/ui-tests/**`

### api-testing

Extended API tests:
- Pattern: `**/example*.spec.ts`
- Depends on: `smoke-tests`

### ui-tests

User interface tests:
- Pattern: `**/ui-tests/**/*.spec.ts`
- baseURL: `https://conduit.bondaracademy.com`

## Reporting

The project is configured to generate several types of reports:

- **HTML Report**: interactive report with test results
- **JUnit XML**: for integration with CI/CD systems
- **Trace**: for debugging failed tests
- **Screenshots**: automatic screenshots when UI tests fail
- **Video**: video recordings when tests fail

## Additional Information

For more information about configuration files, see `config/README.md`.

## Framework Architecture

The framework uses a modular architecture with several layers. This helps reuse code and makes the framework easy to maintain and extend.

### Architecture Layers

#### 1. Configuration Layer

All project settings are stored in one place:

- **api-test.config.ts**: main configuration (URLs, credentials, environments)
- **config/api.config.ts**: API endpoint constants
- **config/test-data.config.ts**: test data and data generation functions

#### 2. Utilities Layer (utils/)

Reusable components for API and test work:

- **request-handler.ts**: HTTP client with fluent API and automatic authentication
- **fixtures.ts**: custom Playwright fixtures with automatic initialization
- **customExpect.ts**: extended assertions with logging
- **schema-validator.ts**: response validation using JSON schemas
- **logger.ts**: centralized logging for API requests
- **data-generator.ts**: test data generation

#### 3. Helpers Layer (helpers/)

- **createToken.ts**: gets authentication token

#### 4. Data Layer

- **request-objects/**: JSON templates for API requests
- **response-schemas/**: JSON schemas for API response validation

#### 5. Tests Layer (tests/)

Tests are organized into projects with dependencies:
- **smoke-tests**: basic functionality checks
- **api-testing**: extended API tests (depends on smoke-tests)
- **ui-tests**: user interface tests

### Used Patterns

#### Builder Pattern (RequestHandler)

Uses fluent API to build requests:

```typescript
const response = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .body(articleData)
    .getRequest(200);
```

#### Fixture Pattern

Custom fixtures for reusing initialization logic:

```typescript
export const test = base.extend<TestOptions, WorkerFixture>({
    authToken: [/* worker-scoped token */],
    api: [/* RequestHandler instance */],
    config: [/* configuration access */],
});
```

#### Configuration Pattern

All configurations are stored in one central place.

#### Schema Validation Pattern

Validates API responses using JSON schemas. Can also generate schemas automatically:

```typescript
await expect(response).shouldMatchSchema('articles', 'GET_articles');
```

#### Logger Pattern

All API operations are logged in one place. This makes debugging easier.

### Test Execution Flow

1. **Initialization**: create authentication token (worker-scope, once per worker)
2. **Fixture Setup**: create `RequestHandler` with token and logger
3. **Test Execution**: use fluent API to make HTTP requests
4. **Validation**: automatic checking of status codes and JSON schemas
5. **Logging**: all requests and responses are logged for debugging
6. **Cleanup**: automatic cleanup of `RequestHandler` state

### Architecture Benefits

- **Code Reuse**: one `RequestHandler` for all API requests
- **Readability**: fluent API makes tests easy to write and read
- **Maintainability**: centralized configurations make changes easier
- **Reliability**: automatic validation of status codes and schemas
- **Debugging**: detailed logging of all API operations
- **Flexibility**: support for different environments (default/qa/prod)
- **Type Safety**: TypeScript checks types automatically

### Example Usage in a Test

```typescript
import { test } from '../utils/fixtures';
import { expect } from '@playwright/test';

test('Create and Delete Article', async ({ api }) => {
    // Generate test data
    const articleRequest = getNewRandomArticle();
    
    // Create article
    const createResponse = await api
        .path('/articles')
        .body(articleRequest)
        .postRequest(201);
    
    // Validate response schema
    await expect(createResponse).shouldMatchSchema('articles', 'POST_article');
    
    // Get slug for deletion
    const slugId = createResponse.article.slug;
    
    // Delete article
    await api.path(`/articles/${slugId}`).deleteRequest(204);
});
```

This example shows the main parts of the architecture:
- Using custom fixture `api`
- Fluent API for building requests
- Automatic status code validation
- JSON schema validation
- Automatic logging of all operations
