const { expect } = require('@playwright/test');

class ProfilePage {
  constructor(page) {
    this.page = page;
    this.path = '/account';
    this.profileSection = page.getByRole('button', { name: 'Profile' });
    this.firstNameField = page.locator('#first_name');
    this.lastNameField = page.locator('#last_name');
    this.emailField = page.locator('#email');
    this.phoneField = page.locator('#phone');
  }

  async open() {
    await this.page.goto(this.path);
    await this._openProfileSection();
  }

  async _openProfileSection() {
    await this.profileSection.click();
    await this.firstNameField.waitFor({ state: 'visible' });
  }

  async getProfile() {
    // Toolshop live application (v2.3) does not expose DOB on the Profile page.
    // Registration captures DOB, but Profile UI does not render it.
    // Therefore DOB cannot be verified through UI automation.
    await expect(this.firstNameField).not.toHaveValue('');

    return {
      firstName: await this.firstNameField.inputValue(),
      lastName: await this.lastNameField.inputValue(),
      email: await this.emailField.inputValue(),
      phone: await this.phoneField.inputValue(),
    };
  }
}

module.exports = { ProfilePage };
