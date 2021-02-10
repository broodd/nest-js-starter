export default () => ({
  server: {
    port: 3000,
  },
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'starter',
    username: 'postgres',
    password: '1234',
    synchronize: true,
    logging: console.log,
  },
  accessToken: {
    secret: 'fg7f6ul5wb',
    expiresIn: '30m',
  },
  refreshToken: {
    expireIn: [1, 'months'],
    maxCount: 5,
  },
});
