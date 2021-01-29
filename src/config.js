module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'test',
  DATABASE_URL: process.env.DATABASE_URL
    || 'postgresql://MikeDent@localhost/spacedrep',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://MikeDent@localhost/spacedreptest',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}
