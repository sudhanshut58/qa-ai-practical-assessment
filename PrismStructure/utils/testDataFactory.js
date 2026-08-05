const DEFAULT_PASSWORD = 'Pr1sm!Test2026';
const DEFAULT_DATE_OF_BIRTH = '1990-05-15';
const DEFAULT_PHONE = '5551234567';

/**
 * Builds a short random suffix for unique email generation.
 * @returns {string}
 */
function uniqueSuffix() {
  return `${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Returns a valid user registration payload with a unique email per call.
 * Password satisfies BR-07; date of birth satisfies BR-08.
 * @returns {{
 *   firstName: string,
 *   lastName: string,
 *   email: string,
 *   password: string,
 *   dateOfBirth: string,
 *   phone: string
 * }}
 */
function buildUser() {
  return {
    firstName: 'John',
    lastName: 'Doe',
    email: `testuser+${uniqueSuffix()}@example.com`,
    password: DEFAULT_PASSWORD,
    dateOfBirth: DEFAULT_DATE_OF_BIRTH,
    phone: DEFAULT_PHONE,
  };
}

/**
 * Returns the approved COD billing address from manual test cases.
 * @returns {{
 *   street: string,
 *   city: string,
 *   state: string,
 *   country: string,
 *   postalCode: string
 * }}
 */
function buildBilling() {
  return {
    street: 'Zoey Shore',
    city: 'Hesselbury',
    state: 'Florida',
    country: 'TG',
    postalCode: '1234AA',
  };
}

/**
 * Returns a valid contact form payload with a unique email per call.
 * @returns {{
 *   name: string,
 *   email: string,
 *   subject: string,
 *   message: string
 * }}
 */
function buildContact() {
  return {
    name: 'QA Tester',
    email: `contact+${uniqueSuffix()}@example.com`,
    subject: 'Order inquiry',
    message: 'Testing contact form submission for assessment.',
  };
}

module.exports = {
  buildUser,
  buildBilling,
  buildContact,
};
