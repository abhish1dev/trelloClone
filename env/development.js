const devConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8089,
  DATABASE_URL: process.env.DATABASE_URL || 'jdbc:mysql://localhost:3306/trelloClone',
  DATABASE_NAME: process.env.DATABASE_NAME || 'trelloClone',
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_USERNAME: process.env.DATABASE_USERNAME || 'root',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
  DATABASE_PORT: process.env.DATABASE_PORT || 3306,
  DATABASE_DIALECT: process.env.DATABASE_DIALECT || 'mysql',
  APP_SECRET: '0a6b944d-d2fb-46fc-a85e-0295c986cd9f',
  TOKEN_LIFE: 604800, // in seconds i.e 7 days
  MAIL_ID: 'example@gmail.com',
  MAIL_PASS: '123456789',
  IMAGE_PATH: 'Path of storage',
  IMAGE_URL: 'http://localhost/trelloClone/public/images/',
  DOMAIN_IP: 'http://localhost:8089/v1.0/',
  APIVERSION: 'v1.0',
  TITLE: 'Trello Clone',
  NAME: 'Trello Clone Backend'
};

module.exports = devConfig;
