# Risk Analysis

## Objective

Identify, classify, and mitigate risks that may affect validation of the Practice Software Testing Toolshop across manual testing, UI automation, and API automation. This analysis covers registration, authentication, catalog discovery, cart, COD checkout, invoice generation, contact submission, and logout within the scoped customer journeys.

---

## Risk Assessment Methodology

| Step | Activity |
|------|----------|
| 1 | Map risks to in-scope flows, functional requirements (FR-01–FR-19), and business rules (BR-01–BR-12) |
| 2 | Classify by domain: functional, UI, API, test data, environment, automation, execution |
| 3 | Rate **Probability** and **Impact** as High, Medium, or Low |
| 4 | Derive **Priority** from probability × impact (Critical / High / Medium / Low) |
| 5 | Define mitigation actions linked to test design, automation, and execution controls |

---

## Risk Priority Scale

| Priority | Definition |
|----------|------------|
| **Critical** | High probability and high impact; blocks core customer journeys (registration, checkout, invoice) or assessment delivery |
| **High** | Significant probability or impact on scoped flows; must be covered before release-quality sign-off |
| **Medium** | Moderate probability or impact; addressed in regression coverage within test volume limits |
| **Low** | Low probability or limited impact on scoped flows; covered when capacity allows |

---

## Functional Risks

| ID | Risk | Area |
|----|------|------|
| RK-F-01 | Invoice not generated when Confirm is clicked only once during UI checkout | Checkout / Invoice (BR-01) |
| RK-F-02 | Invoice missing or incorrect under My Invoices after successful checkout | Invoice (BR-02) |
| RK-F-03 | Cart totals or line items on invoice do not match final cart state after quantity update | Cart → Invoice |
| RK-F-04 | COD checkout completes without valid billing data or rejects valid assessment billing payload | Checkout (BR-11) |
| RK-F-05 | Product filter returns products outside selected brand, category, price, or sort criteria | Catalog / Filter |
| RK-F-06 | Profile data displayed does not match registration input | Profile (FR-04) |
| RK-F-07 | Logout does not terminate session; protected areas remain accessible | Auth / Logout |
| RK-F-08 | Contact form submission fails silently or without user confirmation | Contact (FR-18, FR-19) |
| RK-F-09 | Adding duplicate product updates quantity inconsistently across UI and API | Cart (BR-09) |
| RK-F-10 | Checkout blocked or invoice created for empty or invalid cart | Cart → Invoice (BR-05) |
| RK-F-11 | Search returns incorrect products or no results for valid keywords | Product Search |

---

## UI Risks

| ID | Risk | Area |
|----|------|------|
| RK-UI-01 | Checkout flow breaks due to incorrect handling of double Confirm interaction | Checkout (UI AC2) |
| RK-UI-02 | Product search or filter controls do not refresh listing as expected | Product Search / Filter |
| RK-UI-03 | Product detail page fails to load or add-to-cart action unavailable | Product Details |
| RK-UI-04 | Cart quantity controls (+/− or input) do not persist updated values before checkout | Cart |
| RK-UI-05 | My Invoices page does not display newly created invoice or key fields (number, total, items) | My Invoices |
| RK-UI-06 | Navigation to checkout allowed without authenticated session when session is required | Checkout |
| RK-UI-07 | Billing form validation errors unclear or block COD completion with valid data | Checkout |
| RK-UI-08 | UI displays checkout success while backend invoice creation failed | UI ↔ API sync |
| RK-UI-09 | Responsive layout issues affecting checkout or invoice viewing | Checkout / My Invoices |

---

## API Risks

| ID | Risk | Area |
|----|------|------|
| RK-API-01 | `POST /invoices` returns 401 when Bearer token is missing, expired, or invalid | API Auth (BR-06) |
| RK-API-02 | `POST /invoices` fails with 422 when COD payload omits required fields or uses wrong `payment_details` shape | Invoice (BR-04) |
| RK-API-03 | Invoice created with invalid or empty `cart_id` | API Cart → Invoice |
| RK-API-04 | `GET /carts/{cartId}` does not reflect items added via `POST /carts/{id}` | API Cart |
| RK-API-05 | `PUT /carts/{cartId}/product/quantity` does not update totals used at invoice time | API Cart |
| RK-API-06 | `POST /users/register` returns 409 on duplicate email during parallel or repeated runs | Registration (BR-12) |
| RK-API-07 | `GET /invoices` does not return invoice immediately after successful `POST /invoices` | My Invoices |
| RK-API-08 | `POST /messages` rejects valid contact payload or returns success without persistence | Contact Form |
| RK-API-09 | `GET /users/logout` does not invalidate token for subsequent protected calls | Logout |
| RK-API-10 | Product query parameters (`by_brand`, `by_category`, `between`, `sort`) return incorrect result sets | Products / Filter |

---

## Test Data Risks

| ID | Risk | Area |
|----|------|------|
| RK-TD-01 | Registration fails due to password not meeting complexity rules (BR-07) | Registration |
| RK-TD-02 | Registration fails due to DOB outside 18–75 year range (BR-08) | Registration |
| RK-TD-03 | Reused email addresses cause duplicate-registration failures on shared environment | Registration |
| RK-TD-04 | Hard-coded `product_id` or `cart_id` becomes invalid after catalog or session changes | Cart / Invoice |
| RK-TD-05 | Assessment billing sample rejected by UI or API field validation | Checkout / Invoice |
| RK-TD-06 | Contact form test data exceeds field length limits (name, subject, message) | Contact |

---

## Environment Risks

| ID | Risk | Area |
|----|------|------|
| RK-EN-01 | Public Toolshop UI or API unavailable or intermittently unreachable | Availability |
| RK-EN-02 | Shared environment contention from concurrent testers causes data conflicts | Data isolation |
| RK-EN-03 | UI and API environments out of sync producing inconsistent results | UI ↔ API |
| RK-EN-04 | Network latency increases UI checkout duration beyond token lifetime | Session (NFR-06) |
| RK-EN-05 | Browser compatibility differences across Chromium, Firefox and WebKit | Cross-browser |

---

## Automation Risks

| ID | Risk | Area |
|----|------|------|
| RK-AU-01 | Playwright UI locators break due to DOM or label changes on Toolshop pages | UI automation |
| RK-AU-02 | Double Confirm not encoded in page object or test step sequence | Checkout automation |
| RK-AU-03 | API tests fail to chain dynamic `cart_id` and `product_id` from prior responses | API automation |
| RK-AU-04 | Bearer token not injected or refreshed correctly in API test helpers | API Auth |
| RK-AU-05 | UI and API test layers share state incorrectly causing cross-test pollution | Framework design |
| RK-AU-06 | Smoke and regression tags misapplied; wrong suite scope executed | Test tagging |
| RK-AU-07 | Secrets or live tokens committed to repository artifacts | Security (NFR-02) |

---

## Test Execution Risks

| ID | Risk | Area |
|----|------|------|
| RK-EX-01 | Full UI purchase flow exceeds ~120 second token window mid-execution | Long E2E runs |
| RK-EX-02 | Automated suite fails on shared environment due to transient 5xx or timeout | Flakiness |
| RK-EX-03 | Execution reports or screenshots missing for failed or passed runs | Evidence |
| RK-EX-04 | Manual, UI, and API suites not runnable from documented README commands | Reproducibility (NFR-05) |
| RK-EX-05 | Submission deadline reached with failing tests in final report | Assessment delivery |

---

## Risk Matrix

| Risk ID | Risk Description | Probability | Impact | Priority | Mitigation |
|---------|----------------|-------------|--------|----------|------------|
| RK-F-01 | Invoice not generated with single Confirm click | High | High | **Critical** | Explicit UI test for double Confirm; dedicated POM method |
| RK-F-02 | Invoice not visible under My Invoices | Medium | High | **High** | Assert invoice list after checkout; verify invoice number and totals |
| RK-F-03 | Invoice totals mismatch cart after qty update | Medium | High | **High** | Assert cart before checkout; cross-check invoice line items |
| RK-F-04 | COD checkout fails on valid billing data | Medium | High | **High** | Use documented billing payload; validate UI and API paths |
| RK-F-05 | Product filter returns incorrect results | Medium | Medium | **Medium** | Filter test with known catalog criteria; assert result set |
| RK-F-06 | Profile data inconsistent with registration | Medium | Medium | **Medium** | Field-level profile assertions after UI AC1 |
| RK-F-07 | Session persists after logout | Low | High | **Medium** | Logout test; attempt protected route/API after logout |
| RK-F-08 | Contact form fails without clear feedback | Low | Medium | **Low** | Submit valid payload; assert success message and API 200 |
| RK-F-09 | Duplicate add-to-cart behaves inconsistently | Medium | Medium | **Medium** | Test add same product twice; assert quantity merge (BR-09) |
| RK-F-10 | Checkout or invoice on empty cart | Medium | Medium | **Medium** | Negative test for empty cart checkout |
| RK-UI-01 | Double Confirm mishandled in automation | High | High | **Critical** | `confirmTwice()` in checkout page object; trace on failure |
| RK-UI-02 | Search/filter UI does not update listing | Medium | Medium | **Medium** | Stable locators; wait for network/list refresh |
| RK-UI-05 | My Invoices missing new invoice | Medium | High | **High** | Navigate to My Invoices; assert latest invoice row |
| RK-UI-08 | UI success without API invoice creation | Medium | High | **High** | Optional network assertion or API GET invoices after UI checkout |
| RK-API-01 | 401 on invoice due to token issues | Medium | High | **High** | Auth helper; token refresh or fast flow; negative 401 test |
| RK-API-02 | 422 on invoice payload | Medium | High | **High** | Validate COD payload against BR-04; schema-aligned test data |
| RK-API-03 | Invoice with invalid `cart_id` | Medium | High | **High** | Chain `cart_id` from `POST /carts`; negative invalid ID test |
| RK-API-06 | 409 duplicate email on register | High | Medium | **High** | Unique email generator per run (timestamp/random suffix) |
| RK-API-10 | Incorrect product filter API results | Medium | Medium | **Medium** | Assert filtered `GET /products` response attributes |
| RK-TD-01 | Invalid password in test data | Medium | Medium | **Medium** | Password builder meeting BR-07 rules |
| RK-TD-03 | Duplicate email collisions | High | Medium | **High** | Dynamic unique emails per test execution |
| RK-TD-04 | Stale product or cart IDs | Medium | High | **High** | Resolve IDs at runtime from API responses |
| RK-EN-01 | Environment unavailable | Medium | High | **High** | Pre-run health check; retry policy for transient failures |
| RK-EN-02 | Shared env data pollution | High | Medium | **High** | Isolated users; no shared mutable accounts |
| RK-EN-04 | Token expiry during long UI flow | Medium | High | **High** | Minimize steps; login immediately before purchase flow |
| RK-AU-02 | Double Confirm omitted in scripts | High | High | **Critical** | Single reusable confirm method; code review checklist |
| RK-AU-03 | Broken API response chaining | Medium | High | **High** | API client helpers return IDs to next step |
| RK-AU-07 | Tokens committed to repo | Low | High | **Medium** | Env variables; exclude secrets from commits |
| RK-EX-01 | E2E exceeds token lifetime | Medium | High | **High** | Time-box UI purchase; fresh login in test setup |
| RK-EX-02 | Flaky failures on public host | High | Medium | **High** | Retries for known transient errors; stable waits |
| RK-EX-05 | Failing tests at submission | Medium | High | **High** | Full suite pass required before final evidence capture |

---

## Risk Mitigation Strategy

| Layer | Mitigation approach |
|-------|---------------------|
| **Test design** | Prioritize Critical and High risks in smoke and regression cases; map each risk ID to at least one manual or automated test |
| **Test data** | Factory functions for valid registration, billing, and contact payloads; unique email per run |
| **UI automation** | Page Object Model per module; encapsulate double Confirm, cart update, and My Invoices verification |
| **API automation** | Separate auth, cart, product, invoice, and message clients; chain dynamic IDs; include 401/422 negatives |
| **Environment** | Run against `practicesoftwaretesting.com` and `api.practicesoftwaretesting.com`; health check before suite |
| **Execution** | Tag @Smoke for critical paths; @Regression for extended coverage; capture HTML report and screenshots |
| **Security** | Store tokens in runtime context only; never commit credentials or bearer tokens |

---

## Entry Criteria

| Criterion | Status required |
|-----------|-----------------|
| Requirement Analysis approved and baselined | Complete |
| Toolshop UI and API endpoints reachable | Verified |
| Test environment URLs confirmed | `practicesoftwaretesting.com` / `api.practicesoftwaretesting.com` |
| Test data strategy defined (unique users, dynamic IDs, COD payload) | Documented |
| Playwright project structure and README setup instructions available | In place |
| Risk-to-test traceability draft prepared | Ready for Test Strategy |
| API endpoints verified through Swagger documentation | Verified |

---

## Exit Criteria

| Criterion | Status required |
|-----------|-----------------|
| All Critical and High risks addressed by manual or automated tests | Verified |
| UI AC1, UI AC2, API AC1, and API AC2 executed with evidence | Pass |
| Double Confirm behaviour validated on UI checkout | Pass |
| Invoice verified under My Invoices (UI) and via `GET /invoices` (API) | Pass |
| Smoke and regression suites executed; reports and screenshots archived | Complete |
| All automated tests in submission report show **Passed** status | Required |
| No open Critical defects blocking scoped flows | Confirmed |
| No Critical or High defects remain unresolved | Confirmed |

---

## Risk-Based Testing Approach

Critical and High priority risks map directly to **@Smoke** coverage: registration and login, COD checkout with double Confirm, My Invoices verification, API authentication and cart creation, and invoice generation. These smoke tests validate that core Toolshop journeys are functional before deeper testing proceeds.

Remaining Medium and Low priority risks are addressed in **@Regression** coverage: product search and filter validation, contact form submission, logout session termination, negative API cases, test data edge cases, and extended UI scenarios. Regression execution expands breadth within the 5–8 test case limit per layer without duplicating the full smoke path on every run.

---

*Document: Risk Analysis | Application: Practice Software Testing Toolshop | Status: Baseline for Test Strategy*
