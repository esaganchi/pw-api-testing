import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

[
    {username: 'dd', userNameErrorMessage: 'is too short (minimum is 3 characters)'},
    {username: 'ddd', userNameErrorMessage: ''},
    {username: 'qwertyuiopasdfghjklz', userNameErrorMessage: ''},
    {username: 'dddsadasfasfsdfgsdafsfsdfsdfssf', userNameErrorMessage: 'is too long (maximum is 20 characters)'},
].forEach(({username, userNameErrorMessage}) => {
    test(`Error method validation for username: ${username}`, async ({ api }) => {
        const newUserResponse = await api
            .path('/users')
            .body({
                user: {
                    email: 'd',
                    password: 'd',
                    username: username,
            },
        })
            .clearAuth()
            .postRequest(422);

            if(username.length == 3 || username.length == 20){
                expect(newUserResponse.errors).not.toHaveProperty('username');
            } else {
                expect(newUserResponse.errors.username[0]).shouldEqual(userNameErrorMessage);
            }
    });
});

