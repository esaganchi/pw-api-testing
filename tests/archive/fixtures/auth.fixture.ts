/**
 * Authentication Fixture
 * Custom fixture for handling authentication in tests
 */

import { test as base } from '@playwright/test';
import { API_URLS } from '../../../config/api.config';
import { TEST_USERS } from '../../../config/test-data.config';

type AuthFixtures = {
    authenticatedRequest: {
        request: Awaited<ReturnType<typeof base.extend>>['request'];
        authToken: string;
    };
};

export const test = base.extend<AuthFixtures>({
    authenticatedRequest: async ({ request }, use) => {
        // Perform login
        const loginResponse = await request.post(API_URLS.LOGIN, {
            data: {
                user: {
                    email: TEST_USERS.DEFAULT.email,
                    password: TEST_USERS.DEFAULT.password,
                },
            },
        });

        const loginResponseJson = await loginResponse.json();
        const authToken = `Token ${loginResponseJson.user.token}`;

        // Provide authenticated request context
        await use({
            request,
            authToken,
        });
    },
});

export { expect } from '@playwright/test';
