export default () => ({
  superAdmin: {
    username: process.env.SUPER_ADMIN_USERNAME ?? 'admin',
    password: process.env.SUPER_ADMIN_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  },
  dbUrl: process.env.DB_URL,
});
