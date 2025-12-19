import { test as base } from '@playwright/test';
import { RequestHandler } from './request-handler';
import { APILogger } from './logger';
import { setCustomExpectLogger } from './customExpect';
import { config } from '../api-test.config';

export type TestOptions = {
  api: RequestHandler;
  config: typeof config;
};

export const test = base.extend<TestOptions>({
  api: async ({request}, use) => {
    const logger = new APILogger()
    setCustomExpectLogger(new APILogger())
    const requestHandler = new RequestHandler(request, config.apiUrl, logger)
    await use(requestHandler);
  },
  config: async ({}, use) => {
    await use(config);
  }
}); 