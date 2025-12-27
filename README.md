# Playwright API and UI Testing Framework

Automated testing framework for API and UI of Conduit application (Bondar Academy) using Playwright and TypeScript.

## Table of Contents

- [Project Overview](#project-overview)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Framework Architecture](#framework-architecture)
- [Components](#components)
- [Additional Resources](#additional-resources)

## Project Overview

This project provides automated testing for REST API endpoints and user interface of a web application. It uses a modular architecture with reusable components, custom fixtures, and automatic validation.

**Key Features:**
- REST API testing with automatic authentication
- UI testing with browser automation
- JSON schema validation
- Custom assertions with logging
- Support for multiple environments
- Fluent API for building requests

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps
```

### Environment Setup

Create a `.env` file in the project root (optional, only for `prod` environment):

```env
USER_EMAIL=your_email@example.com
USER_PASSWORD=your_password
TEST_ENV=prod
```

### Run Tests

```bash
# Run all tests
npx playwright test

# Run specific project
npx playwright test --project=smoke-tests

# Run in UI mode
npx playwright test --ui
```

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

## Configuration

### Main Configuration

The `api-test.config.ts` file contains:
- **API URL**: `https://conduit-api.bondaracademy.com/api`
- **UI URL**: `https://conduit.bondaracademy.com`
- **Credentials**: environment-specific values

### Environments

Supported environments (defined by `TEST_ENV` variable):
- **default**: uses default values from configuration
- **qa**: uses QA environment values from configuration
- **prod**: uses environment variables (`.env`) or default values

### Credentials

Credentials are stored in:
1. `api-test.config.ts` - main credentials for different environments
2. `config/test-data.config.ts` - additional test data
3. `.env` file - environment variables for prod (USER_EMAIL, USER_PASSWORD)

For prod environment, credentials are taken from environment variables or default values from `api-test.config.ts`.

### Playwright Configuration

The `playwright.config.ts` defines:
- **Test Projects**: `smoke-tests`, `api-testing`, `ui-tests`
- **Trace**: enabled for all tests
- **Screenshots**: created when tests fail
- **Video**: recorded when tests fail
- **Reporters**: HTML, list, and JUnit XML

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Specific Project

```bash
# Smoke tests (basic functionality)
npx playwright test --project=smoke-tests

# Extended API tests
npx playwright test --project=api-testing

# UI tests
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

### View Reports

```bash
# HTML report
npx playwright show-report

# View trace
npx playwright show-trace path/to/trace.zip
```

## Framework Architecture

### Architecture Layers

#### 1. Configuration Layer
- `api-test.config.ts` - main configuration (URLs, credentials, environments)
- `config/api.config.ts` - API endpoint constants
- `config/test-data.config.ts` - test data and data generation functions

#### 2. Utilities Layer (utils/)
- `request-handler.ts` - HTTP client with fluent API and automatic authentication
- `fixtures.ts` - custom Playwright fixtures with automatic initialization
- `customExpect.ts` - extended assertions with logging
- `schema-validator.ts` - response validation using JSON schemas
- `logger.ts` - centralized logging for API requests
- `data-generator.ts` - test data generation

#### 3. Helpers Layer (helpers/)
- `createToken.ts` - authentication token creation

#### 4. Data Layer
- `request-objects/` - JSON templates for API requests
- `response-schemas/` - JSON schemas for API response validation

#### 5. Tests Layer (tests/)
- `smoke-tests` - basic functionality checks
- `api-testing` - extended API tests (depends on smoke-tests)
- `ui-tests` - user interface tests

### Design Patterns

#### Builder Pattern (RequestHandler)
Fluent API for building requests:

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

#### Schema Validation Pattern
Validates API responses using JSON schemas:

```typescript
await expect(response).shouldMatchSchema('articles', 'GET_articles');
```

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

## Components

### RequestHandler

Class in `utils/request-handler.ts` for API requests:
- Methods: `getRequest()`, `postRequest()`, `putRequest()`, `deleteRequest()`
- Method chains: `.path()`, `.body()`, `.params()`, `.clearAuth()`
- Automatic response handling and status code validation

### Schema Validator

API response validation using JSON schemas from `response-schemas/`:

```typescript
await expect(response).shouldMatchSchema('articles', 'GET_articles');
```

Schemas can be auto-generated by passing `true` as the third parameter:

```typescript
await expect(response).shouldMatchSchema('articles', 'GET_articles', true);
```

### Custom Expectations

Custom assertions in `utils/customExpect.ts`:
- `shouldEqual()`: comparison with logging
- `shouldBeLessThanOrEqual()`: comparison with logging
- `shouldMatchSchema()`: schema validation with optional auto-generation

### Logger

Logging API requests and responses through `utils/logger.ts`. All API operations are automatically logged for debugging.

### Test Projects

#### smoke-tests
Basic tests to check main functionality:
- Pattern: `**/{smoke,negative}*.spec.ts`
- Excludes: `**/ui-tests/**`

#### api-testing
Extended API tests:
- Pattern: `**/example*.spec.ts`
- Depends on: `smoke-tests`

#### ui-tests
User interface tests:
- Pattern: `**/ui-tests/**/*.spec.ts`
- baseURL: `https://conduit.bondaracademy.com`

### Example Usage

#### API Test Example

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

#### UI Test Example

```typescript
import { test, expect } from '@playwright/test';
import { config } from '../../api-test.config';

test('create article', async ({ page }) => {
    await page.goto('/');
    // ... UI interaction
});
```

## Additional Resources

### Code Formatting

```bash
# Check formatting
npm run format:check

# Auto format
npm run format
```

### Reporting

The project generates several types of reports:
- **HTML Report**: interactive report with test results
- **JUnit XML**: for integration with CI/CD systems
- **Trace**: for debugging failed tests
- **Screenshots**: automatic screenshots when UI tests fail
- **Video**: video recordings when tests fail

### Additional Documentation

For more information about configuration files, see `config/README.md`.
