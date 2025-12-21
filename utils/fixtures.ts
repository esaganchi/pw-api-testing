import { test as base } from '@playwright/test';
import { RequestHandler } from './request-handler';
import { APILogger } from './logger';
import { setCustomExpectLogger } from './customExpect';
import { config } from '../api-test.config';
import { createToken } from '../helpers/createToken';

export type TestOptions = {
    api: RequestHandler;
    config: typeof config;
};

export type WorkerFixture = {
    authToken: string;
};

export const test = base.extend<TestOptions, WorkerFixture>({
    authToken: [
        async ({}, use) => {
            let authToken = '';
            if (config.userEmail && config.userPassword) {
                authToken = await createToken(config.userEmail, config.userPassword);
            }
            await use(authToken);
        },
        { scope: 'worker' },
    ],

    api: async ({ request, authToken }, use) => {
        const logger = new APILogger();
        setCustomExpectLogger(new APILogger());
        const requestHandler = new RequestHandler(request, config.apiUrl, logger, authToken);
        await use(requestHandler);
    },
    config: async ({}, use) => {
        await use(config);
    },
});
