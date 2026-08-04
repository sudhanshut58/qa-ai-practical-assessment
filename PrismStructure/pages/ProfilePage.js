class ProfilePage {
  constructor(page) {
    this.page = page;
    this.path = '/account';
    this.firstNameField = page.locator('#first_name');
    this.lastNameField = page.locator('#last_name');
    this.emailField = page.locator('#email');
    this.dateOfBirthField = page.locator('#dob');
    this.phoneField = page.locator('#phone');
  }

  async open() {
    await this.page.goto(this.path);
  }

  async getProfile() {
    return {
      firstName: await this.firstNameField.inputValue(),
      lastName: await this.lastNameField.inputValue(),
      email: await this.emailField.inputValue(),
      dateOfBirth: await this.dateOfBirthField.inputValue(),
      phone: await this.phoneField.inputValue(),
    };
  }
}

module.exports = { ProfilePage };
