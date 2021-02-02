module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL
    || 'postgres://kkpyncyowhbmxr:128a6cf0f96122fe8f0444c9ca2902d3df9a6aec2897fde8af8da94b5a878825@ec2-34-192-106-123.compute-1.amazonaws.com:5432/d7380l862shhpd',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://MikeDent@localhost/spacedreptest',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://spaced-repetition-md.vercel.app'
}
