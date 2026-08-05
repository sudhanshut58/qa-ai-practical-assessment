const DEFAULT_REGISTRATION_ADDRESS = {
  country: 'TG',
  postalCode: '1234AA',
  houseNumber: '42',
  street: 'Zoey Shore',
  city: 'Hesselbury',
  state: 'Florida',
};

class RegisterPage {
  constructor(page) {
    this.page = page;
    this.path = '/auth/register';
    this.firstNameInput = page.locator('[data-test="first-name"]');
    this.lastNameInput = page.locator('[data-test="last-name"]');
    this.dateOfBirthInput = page.locator('[data-test="dob"]');
    this.countrySelect = page.locator('[data-test="country"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"]');
    this.houseNumberInput = page.locator('[data-test="house_number"]');
    this.streetInput = page.locator('[data-test="street"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.phoneInput = page.locator('[data-test="phone"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.registerButton = page.locator('[data-test="register-submit"]');
    this.signInNav = page.locator('[data-test="nav-sign-in"]');
  }

  async open() {
    await this.page.goto(this.path);
  }

  async register(user) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.dateOfBirthInput.fill(user.dateOfBirth);
    await this.countrySelect.selectOption(DEFAULT_REGISTRATION_ADDRESS.country);
    await this.postalCodeInput.fill(DEFAULT_REGISTRATION_ADDRESS.postalCode);
    await this.houseNumberInput.fill(DEFAULT_REGISTRATION_ADDRESS.houseNumber);
    await this.streetInput.fill(DEFAULT_REGISTRATION_ADDRESS.street);
    await this.cityInput.fill(DEFAULT_REGISTRATION_ADDRESS.city);
    await this.stateInput.fill(DEFAULT_REGISTRATION_ADDRESS.state);
    await this.phoneInput.fill(user.phone);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);

    const registerResponsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/users/register') &&
        response.request().method() === 'POST' &&
        response.status() === 201
    );

    await this.registerButton.click();
    await registerResponsePromise;
    await Promise.race([
      this.page.waitForURL('**/account'),
      this.page.waitForURL('**/auth/login'),
      this.signInNav.waitFor({ state: 'hidden' }),
    ]);
  }
}

module.exports = { RegisterPage };
