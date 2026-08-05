const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../../pages/RegisterPage');
const { LoginPage } = require('../../pages/LoginPage');
const { ProfilePage } = require('../../pages/ProfilePage');
const { buildUser } = require('../../utils/testDataFactory');

test('TC-001: should register, login, and verify profile information @Smoke', async ({
  page,
}) => {
  const user = buildUser();
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);
  const profilePage = new ProfilePage(page);

  await registerPage.open();
  await registerPage.register(user);

  await loginPage.open();
  await loginPage.login(user.email, user.password);

  await profilePage.open();
  const profile = await profilePage.getProfile();

  expect(profile.firstName).toBe(user.firstName);
  expect(profile.lastName).toBe(user.lastName);
  expect(profile.email).toBe(user.email);
  expect(profile.phone).toBe(user.phone);
});
