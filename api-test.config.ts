import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

const processENV = process.env.TEST_ENV;
const env = processENV || 'prod';
console.log('Test environment is: ' + env);

const config = {
  apiUrl: 'https://conduit-api.bondaracademy.com/api',
  uiUrl: 'https://conduit.bondaracademy.com',
  userEmail: 'pwapuiuser@test.com',
  userPassword: 'Welcome'
};

if (env === 'qa') {
  config.userEmail = 'pwtest@test.com';
  config.userPassword = 'Welcome2';
}

if (env === 'prod') {
  config.userEmail = (process.env.USER_EMAIL || 'saga1999@gmail.com') as string;
  config.userPassword = (process.env.USER_PASSWORD || 'saga1993') as string;
}

export { config };