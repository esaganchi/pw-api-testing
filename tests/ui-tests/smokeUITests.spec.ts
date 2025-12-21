import { test, expect, request } from '@playwright/test';
import { config } from '../../api-test.config';

test('create article', async ({ page, request }) => {
  await page.goto('/');

  await page.getByText('Sign in').click();
  
  await page.getByRole('textbox', { name: 'Email' }).fill(config.userEmail);
  await page.getByRole('textbox', { name: 'Password' }).fill(config.userPassword);
  
  // Кликаем и ждем загрузки страницы после логина
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Ждем, пока форма логина исчезнет (это означает, что началась навигация)
  await page.waitForSelector('text=Sign in', { state: 'hidden', timeout: 10000 }).catch(() => {});
  
  // Ждем загрузки страницы после логина
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  
  // Проверяем текущий URL после логина для отладки
  const currentUrl = page.url();
  console.log('URL after login:', currentUrl);
  
  // Ждем появления элемента "New Article" в хедере (используем role link, так как это ссылка)
  // Если не найдем как link, попробуем как text
  try {
    await page.getByRole('link', { name: 'New Article' }).waitFor({ state: 'visible', timeout: 10000 });
  } catch (e) {
    console.log('Link not found, trying text selector');
    await page.getByText('New Article').waitFor({ state: 'visible', timeout: 10000 });
  }
  
  // Используем тот же селектор, который использовали для ожидания
  const newArticleLink = page.getByRole('link', { name: 'New Article' });
  if (await newArticleLink.count() === 0) {
    // Если link не найден, пробуем text
    await page.getByText('New Article').click();
  } else {
    await newArticleLink.click();
  }
  await page.getByRole('textbox', { name: 'Article Title' }).fill('Playwright is awesome');
  await page.getByRole('textbox', { name: "What's this article about?" }).fill('About the Playwright');
  await page
    .getByRole('textbox', { name: 'Write your article (in markdown)' })
    .fill('We like to use playwright for ...');
  await page.getByRole('button', { name: 'Publish Article' }).click();
  await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome');

  await page.getByText('Home').first().click();
  await page.getByText('Global Feed').click();

  await page.getByText('Playwright is awesome').click();
  await page.getByRole('button', { name: 'Delete Article' }).first().click();
  await page.getByText('Global Feed').click();

  // await expect(page.locator('app-article-list h1').first()).not.toContainText('This article was deleted');
});
