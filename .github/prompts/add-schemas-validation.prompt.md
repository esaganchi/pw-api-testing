# Custom Prompt: Add Schema Validation

Add `shouldMatchSchema()` validation to all API requests in this file that return responses.

**Reference:** Follow the detailed schema validation instruction: [schema-validation](../instructions/schema-validation.instructions.md)

## Task Requirements

### What to Add
- ✅ Add schema validation to **GET, POST, PUT** requests (any request with response body)
- ❌ **Skip DELETE** requests (no response body expected)
- ⏭️ **Skip** requests that already have `shouldMatchSchema()` validation

### Implementation Rules

1. **Placement**: Add validation **immediately after** the API request, **before** any other assertions
2. **Syntax**: Use `await expect(response).shouldMatchSchema(...)`
3. **Schema Generation**: Set third argument to `true` to auto-generate/update schemas
4. **Naming**: Follow naming conventions from the instruction file

### Naming Convention Quick Reference

- **Folder name**: Extract from endpoint path (remove leading slash)
  - `/articles` → `"articles"`
  - `/tags` → `"tags"`
  
- **File name**: `"[METHOD]_[endpoint]"`
  - GET `/articles` → `"GET_articles"`
  - POST `/articles` → `"POST_article"` (singular for single resource)
  - PUT `/articles/{slug}` → `"PUT_article"`
  - GET `/articles/{slug}` → `"GET_article"` (singular for single resource)

## Examples

### GET Request
```typescript
const response = await api
    .path('/articles')
    .getRequest(200);
await expect(response).shouldMatchSchema('articles', 'GET_articles', true);
```

### POST Request
```typescript
const createResponse = await api
    .path('/articles')
    .body(articleData)
    .postRequest(201);
await expect(createResponse).shouldMatchSchema('articles', 'POST_article', true);
```

### PUT Request
```typescript
const updateResponse = await api
    .path(`/articles/${slug}`)
    .body(articleData)
    .putRequest(200);
await expect(updateResponse).shouldMatchSchema('articles', 'PUT_article', true);
```

### DELETE Request (Skip)
```typescript
await api
    .path(`/articles/${slugId}`)
    .deleteRequest(204);
// No schema validation needed for DELETE
```