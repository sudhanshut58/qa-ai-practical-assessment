const DEFAULT_BASE_URL = 'https://practicesoftwaretesting.com';
const DEFAULT_API_BASE_URL = 'https://api.practicesoftwaretesting.com';

const BASE_URL = process.env.BASE_URL || DEFAULT_BASE_URL;
const API_BASE_URL = process.env.API_BASE_URL || DEFAULT_API_BASE_URL;
const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

module.exports = {
  BASE_URL,
  API_BASE_URL,
  TEST_EMAIL,
  TEST_PASSWORD,
};
