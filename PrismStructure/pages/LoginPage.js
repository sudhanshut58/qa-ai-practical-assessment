class LoginPage {
  constructor(page) {
    this.page = page;
    this.path = '/auth/login';
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-submit"]');
    this.signInNav = page.locator('[data-test="nav-sign-in"]');
  }

  async open() {
    await this.page.goto(this.path);
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    const loginResponsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/users/login') &&
        response.request().method() === 'POST' &&
        response.status() === 200
    );

    await this.loginButton.click();
    await loginResponsePromise;
    await this.signInNav.waitFor({ state: 'hidden' });
  }
}

module.exports = { LoginPage };
