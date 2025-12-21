# Playwright API and UI Testing Framework

Проект автоматизированного тестирования API и пользовательского интерфейса приложения Conduit (Bondar Academy) с использованием Playwright и TypeScript.

## Описание проекта

Этот проект содержит автоматизированные тесты для проверки функциональности API и UI веб-приложения. Проект поддерживает тестирование REST API endpoints и пользовательского интерфейса через браузерную автоматизацию.

## Структура проекта

```
pw-api-testing/
├── config/                  # Конфигурационные файлы
│   ├── api.config.ts       # Конфигурация API endpoints
│   ├── test-data.config.ts # Тестовые данные и учетные данные
│   └── index.ts            # Централизованный экспорт конфигураций
├── helpers/                 # Вспомогательные функции
│   └── createToken.ts      # Создание токенов аутентификации
├── request-objects/         # JSON объекты для API запросов
│   └── POST-article.json   # Шаблон запроса для создания статьи
├── response-schemas/        # JSON схемы для валидации ответов API
│   ├── articles/           # Схемы для статей
│   └── tags/               # Схемы для тегов
├── tests/                   # Тестовые файлы
│   ├── api-tests/          # API тесты
│   │   ├── smokeTest.spec.ts
│   │   ├── negativeTests.spec.ts
│   │   └── example.spec.ts
│   ├── ui-tests/           # UI тесты
│   │   └── smokeUITests.spec.ts
│   └── archive/            # Архив старых тестов
├── utils/                   # Утилиты для тестов
│   ├── fixtures.ts         # Playwright fixtures с кастомными опциями
│   ├── request-handler.ts  # Обработчик HTTP запросов
│   ├── customExpect.ts     # Кастомные assertions
│   ├── schema-validator.ts # Валидатор JSON схем
│   ├── logger.ts           # Логгер для API запросов
│   └── data-generator.ts   # Генератор тестовых данных
├── api-test.config.ts      # Основная конфигурация проекта
├── playwright.config.ts    # Конфигурация Playwright
└── package.json            # Зависимости проекта
```

## Установка и настройка

### Требования

- Node.js (LTS версия)
- npm или yarn

### Установка зависимостей

```bash
npm install
```

### Установка браузеров Playwright

```bash
npx playwright install --with-deps
```

### Настройка переменных окружения

Создайте файл `.env` в корне проекта (если необходимо переопределить дефолтные значения):

```env
USER_EMAIL=your_email@example.com
USER_PASSWORD=your_password
TEST_ENV=prod
```

Переменные окружения используются только для окружения `prod`. Для других окружений используются значения из `api-test.config.ts`.

## Конфигурация

### Основная конфигурация

Файл `api-test.config.ts` содержит основную конфигурацию проекта:

- **API URL**: `https://conduit-api.bondaracademy.com/api`
- **UI URL**: `https://conduit.bondaracademy.com`
- **Учетные данные**: зависят от окружения (prod/qa/default)

### Окружения

Проект поддерживает несколько окружений, определяемых переменной `TEST_ENV`:

- **default**: используются дефолтные значения из конфигурации
- **qa**: используются значения для QA окружения из конфигурации
- **prod**: из переменных окружения или дефолтные значения из конфигурации

### Конфигурация Playwright

Файл `playwright.config.ts` определяет:

- **Проекты тестов**: разделение на `smoke-tests`, `api-testing`, `ui-tests`
- **Trace**: включен для всех тестов
- **Screenshots**: создаются при падении тестов
- **Video**: записывается при падении тестов

## Запуск тестов

### Запуск всех тестов

```bash
npx playwright test
```

### Запуск конкретного проекта

```bash
# Только smoke тесты
npx playwright test --project=smoke-tests

# Только API тесты
npx playwright test --project=api-testing

# Только UI тесты
npx playwright test --project=ui-tests
```

### Запуск конкретного файла

```bash
npx playwright test tests/api-tests/smokeTest.spec.ts
```

### Запуск в UI режиме

```bash
npx playwright test --ui
```

### Запуск с отладкой

```bash
npx playwright test --debug
```

## Просмотр отчетов

### HTML отчет

```bash
npx playwright show-report
```

### Просмотр trace

```bash
npx playwright show-trace path/to/trace.zip
```

## Типы тестов

### API тесты

API тесты используют кастомный fixture `api` из `utils/fixtures.ts`, который предоставляет:

- **RequestHandler**: обертка для HTTP запросов с автоматической аутентификацией
- **Автоматический токен**: токен создается автоматически перед запуском тестов
- **Логирование**: все API запросы логируются

Пример использования:

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

### UI тесты

UI тесты используют стандартные Playwright fixtures (`page`, `request`) и работают с браузером:

```typescript
import { test, expect } from '@playwright/test';
import { config } from '../../api-test.config';

test('create article', async ({ page }) => {
    await page.goto('/');
    // ... взаимодействие с UI
});
```

## Основные компоненты

### RequestHandler

Класс в `utils/request-handler.ts` для упрощения работы с API запросами:

- Методы: `getRequest()`, `postRequest()`, `putRequest()`, `deleteRequest()`
- Цепочки методов: `.path()`, `.body()`, `.params()`, `.clearAuth()`
- Автоматическая обработка ответов

### Schema Validator

Валидация ответов API по JSON схемам из `response-schemas/`:

```typescript
await expect(response).shouldMatchSchema('articles', 'GET_articles');
```

### Custom Expectations

Кастомные assertions в `utils/customExpect.ts`:

- `shouldEqual()`: сравнение с логированием
- `shouldMatchSchema()`: валидация по схеме

### Logger

Логирование API запросов и ответов через `utils/logger.ts`.

## Учетные данные

Учетные данные хранятся в следующих местах:

1. **api-test.config.ts**: основные учетные данные для разных окружений
2. **config/test-data.config.ts**: дополнительные тестовые данные
3. **.env файл**: переменные окружения для prod (USER_EMAIL, USER_PASSWORD)

Для prod окружения учетные данные берутся из переменных окружения (USER_EMAIL, USER_PASSWORD) или используются дефолтные значения, указанные в `api-test.config.ts`.

## Форматирование кода

Проверка форматирования:

```bash
npm run format:check
```

Автоматическое форматирование:

```bash
npm run format
```

## Структура тестовых проектов

### smoke-tests

Базовые тесты для проверки основной функциональности:
- Паттерн: `**/{smoke,negative}*.spec.ts`
- Исключает: `**/ui-tests/**`

### api-testing

Расширенные API тесты:
- Паттерн: `**/example*.spec.ts`
- Зависит от: `smoke-tests`

### ui-tests

Тесты пользовательского интерфейса:
- Паттерн: `**/ui-tests/**/*.spec.ts`
- baseURL: `https://conduit.bondaracademy.com`

## Отчетность

Проект настроен на генерацию нескольких типов отчетов:

- **HTML отчет**: интерактивный отчет с результатами тестов
- **JUnit XML**: для интеграции с CI/CD системами
- **Trace**: для отладки неудачных тестов
- **Screenshots**: автоматические скриншоты при падении UI тестов
- **Video**: видео записи при падении тестов

## Дополнительная информация

Подробнее о конфигурационных файлах смотрите в `config/README.md`.

