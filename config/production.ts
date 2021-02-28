export default () => ({
  server: {
    port: 3000,
    baseUrl: 'http://broodd.tech',
  },
  database: {
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    database: 'starter',
    username: 'starter',
    password: '1234',
    synchronize: true,
    logging: false,
  },
  accessToken: {
    secret: 'fg7f6ul5wb',
    expiresIn: '30m',
  },
  refreshToken: {
    expireIn: [1, 'months'],
    maxCount: 5,
  },
  cache: {
    ttl: 3600,
  },
  s3: {
    endpoint: 'fra1.digitaloceanspaces.com',
    bucketName: 'starter-files',
  },
  i18n: {
    fallbackLang: 'en',
  },
});
