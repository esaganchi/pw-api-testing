const processENV = process.env.TEST_ENV;
const env = processENV || 'prod';
console.log('Test environment is: ' + env);

const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'saga1993@gmail.com',
    userPassword: 'saga1993',
};

if (env === 'qa') {
    ((config.userEmail = 'pwtest@test.com'), (config.userPassword = 'Welcome2'));
}

export { config };
