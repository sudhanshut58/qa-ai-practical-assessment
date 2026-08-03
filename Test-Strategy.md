# Test Strategy

## Objective

Define how the Practice Software Testing Toolshop will be validated for the GenAI QA automation assessment. The strategy aligns manual testing, Playwright UI automation, and Playwright API automation to confirm customer journeys, business rules, and submission deliverables within a controlled test volume (5–8 cases per layer).

---

## Test Scope

| In scope | Out of scope |
|----------|--------------|
| Registration, login, logout, profile verification | Admin operations and reports |
| Product listing, search, filter, product details | TOTP / two-factor authentication |
| Cart — add items, update quantity | Guest checkout |
| COD checkout, double Confirm, My Invoices | Non-COD payment methods |
| API auth, cart, products, invoice, contact | Invoice PDF download |
| Contact form submission | Password recovery flows |
| Smoke (@Smoke) and regression (@Regression) tiers | Cross-browser matrix beyond Playwright default |

**Assessment acceptance criteria:** UI AC1, UI AC2, API AC1, API AC2.

---

## Test Levels

| Level | Application | Toolshop focus |
|-------|-------------|----------------|
| **Component / API** | REST endpoints | Register, login, products, cart, invoice, messages |
| **UI / System** | Browser storefront | Catalog, cart, checkout, My Invoices, contact |
| **End-to-end** | UI + API combined journeys | Full purchase path; optional UI outcome vs API verification |

---

## Test Types

| Test type | Purpose in this project |
|-----------|-------------------------|
| **Smoke Testing** | Fast validation of Critical/High-risk paths; confirms Toolshop is testable and core journeys work |
| **Regression Testing** | Broader coverage of in-scope flows, negatives, and edge cases within 5–8 cases per layer |
| **Functional Testing** | Verify features behave per FR-01–FR-19 (manual CSV + automated assertions) |
| **UI Testing** | Playwright browser tests for customer flows on `practicesoftwaretesting.com` |
| **API Testing** | Playwright `request` context tests against `api.practicesoftwaretesting.com` |
| **Negative Testing** | Invalid login, missing token (401), duplicate email (409), invalid cart/invoice payload (422) |
| **Boundary Testing** | Password rules, DOB range, field lengths on registration and contact forms |
| **End-to-End Testing** | UI AC2 full purchase; API AC2 register-to-invoice chain |

---

## Test Approach

Testing proceeds in three coordinated layers:

```
Exploratory validation (manual) → Test case design (CSV) → Automation (UI + API)
```

| Layer | Role | When used |
|-------|------|-----------|
| **Manual** | First execution of flows; capture expected results, screenshots, and edge behaviour (e.g. double Confirm) | Before automation; evidence for assessment |
| **UI automation** | Repeatable Playwright tests for storefront journeys using Page Object Model | Smoke + regression UI suite |
| **API automation** | Independent validation of backend contracts; faster setup for cart and invoice chains | Smoke + regression API suite |

**Workflow:** Manual cases define pass/fail criteria. UI automation covers browser interactions and visual confirmation (My Invoices, profile). API automation validates the same business outcomes without UI dependency and supports negative contract tests. Critical paths run under @Smoke; extended coverage runs under @Regression. AI tools (Cursor AI, ChatGPT) assist test design and automation scaffolding; all outputs are reviewed before commit to GitHub.

---

## Requirement Traceability Approach

Traceability links each artefact from requirements through execution:

```
Requirements
    ↓
RTM
    ↓
Manual Test Cases
    ↓
UI Automation
    ↓
API Automation
```

Functional requirements (FR-01–FR-19) and business rules (BR-01–BR-12) map to risk IDs in the RTM. Manual cases in `FunctionalTestCase.csv` reference requirement and risk IDs. UI and API Playwright specs reference the same manual case IDs to maintain end-to-end traceability across layers.

---

## Test Pyramid

```
        UI E2E
           ↓
        UI Smoke
           ↓
        API Tests
           ↓
   Unit Tests (Not in Scope)
```

This assessment focuses mainly on **API and UI automation using Playwright**. API tests provide fast contract validation for auth, cart, and invoice flows. UI smoke and E2E tests validate customer journeys on the Toolshop storefront, including double Confirm and My Invoices. Unit tests are out of scope for this project.

---

## Smoke Test Scope

Critical business flows only — execution target ~15–20 minutes (manual) or minimal automated suite.

| ID | Flow | Layer |
|----|------|-------|
| SMK-01 | Register → Login → Verify profile (UI AC1) | Manual, UI |
| SMK-02 | Login → Browse → Add products → Update qty → COD checkout → Confirm ×2 → My Invoices (UI AC2) | Manual, UI |
| SMK-03 | Register → Login → Bearer token → Create cart (API AC1) | Manual, API |
| SMK-04 | Products → Add to cart → Verify cart → POST invoice COD (API AC2) | Manual, API |
| SMK-05 | Application homepage and product listing reachable | UI |

---

## Regression Test Scope

Complete in-scope business coverage within 5–8 cases per layer.

| Area | Regression coverage |
|------|---------------------|
| **Authentication** | Valid/invalid login; logout; profile field match; API 401 without token |
| **Catalog** | Product listing; search with valid keyword; filter by brand/category/price/sort |
| **Cart** | Multiple products; quantity update; duplicate product quantity merge |
| **Checkout** | COD billing; single Confirm (negative); double Confirm (positive) |
| **Invoice** | My Invoices UI verification; GET `/invoices` after POST; line items and totals |
| **Contact** | Form submission UI + `POST /messages` |
| **API negatives** | 409 duplicate register; 422 invalid invoice payload; invalid `cart_id` |
| **Boundaries** | Weak password; invalid DOB; contact field length limits |

---

## Test Environment

| Item | Detail |
|------|--------|
| **UI** | https://practicesoftwaretesting.com/ |
| **API** | https://api.practicesoftwaretesting.com/api/documentation |
| **API base** | https://api.practicesoftwaretesting.com |
| **Type** | Public shared hosted environment |
| **Browser (automation)** | Default execution: Chromium. Framework supports Chromium, Firefox and WebKit. |
| **OS** | Windows (local execution) |
| **Repository** | Public GitHub — `qa-ai-practical-assessment` |
| **Pre-run check** | UI and API reachable; Swagger endpoints verified |

---

## Test Data Strategy Summary

| Data type | Strategy |
|-----------|----------|
| **Users** | Unique email per test run (`testuser+{timestamp}@example.com` pattern) |
| **Password** | Fixed valid password meeting complexity rules (uppercase, lowercase, number, symbol, min 8) |
| **DOB** | Static valid date within 18–75 year range |
| **Product IDs** | Resolved at runtime from `GET /products` — not hard-coded |
| **Cart ID** | Chained from `POST /carts` response |
| **Billing (COD)** | Assessment sample payload (`Zoey Shore`, `Hesselbury`, `Florida`, `TG`, `1234AA`, `payment_details: {}`) |
| **Contact** | Valid name, email, subject, message within API field limits |
| **Tokens** | Obtained at runtime via login; stored in test context only — never committed |

---

## Test Automation Strategy

### Framework

| Item | Approach |
|------|----------|
| **Tool** | Playwright (JavaScript) |
| **Structure** | Prism-style folder layout under `PrismStructure/` |
| **Config** | `playwright.config.js` — separate UI and API projects |

### Page Object Model (UI)

| Page object | Responsibility |
|-------------|----------------|
| `RegisterPage` | Registration form and validation messages |
| `LoginPage` | Login and session entry |
| `ProfilePage` | Profile field verification |
| `ProductsPage` | Listing, search, filter |
| `CartPage` | Add items, quantity update |
| `CheckoutPage` | Billing, COD selection, `confirmTwice()` |
| `InvoicesPage` | My Invoices list and detail |
| `ContactPage` | Contact form submission |

### API Layer

| Client / helper | Endpoints |
|---------------|-----------|
| `AuthApi` | `/users/register`, `/users/login`, `/users/me`, `/users/logout` |
| `ProductApi` | `/products` (with query filters) |
| `CartApi` | `/carts`, add, get, update quantity |
| `InvoiceApi` | `POST /invoices`, `GET /invoices` |
| `ContactApi` | `POST /messages` |

### Reusable Utilities

| Utility | Purpose |
|---------|---------|
| `testDataFactory.js` | User, billing, contact payload builders |
| `authHelper.js` | Register-login-token wrapper |
| `assertions.js` | Invoice and cart comparison helpers |
| `env.js` | Base URLs and runtime configuration |

### Test Tags

| Tag | Usage | Command pattern |
|-----|-------|-----------------|
| `@Smoke` | Critical paths (SMK-01–SMK-05) | `npx playwright test --grep @Smoke` |
| `@Regression` | Extended coverage and negatives | `npx playwright test --grep @Regression` |

Manual test cases in `FunctionalTestCase.csv` use matching Smoke/Regression columns for traceability.

---

## Defect Management Approach

| Severity | Definition | Action |
|----------|------------|--------|
| **Critical** | Blocks UI AC1/AC2 or API AC1/AC2 (e.g. invoice not created, double Confirm failure) | Stop smoke; log defect with steps, screenshot, network trace |
| **High** | Major flow broken but workaround exists (e.g. filter wrong, My Invoices empty) | Log defect; add regression test after fix |
| **Medium** | Non-blocking UI/API inconsistency or validation message issue | Log in defect report; schedule for regression |
| **Low** | Cosmetic or minor UX issue | Note in exploratory notes; fix if time permits |

Defects will be documented in GitHub Issues or a simple execution defect log during testing. Each entry includes: title, steps, expected/actual, environment, screenshot, API response. Root cause noted for automation failures. Re-test after fix before closing.

---

## Entry Criteria

| Criterion | Required |
|-----------|----------|
| Requirement Analysis and Risk Analysis baselined | Yes |
| Toolshop UI and API reachable | Yes |
| API endpoints verified in Swagger | Yes |
| Test data strategy documented | Yes |
| Playwright project scaffold and README setup steps | Yes |
| Manual test case template (`FunctionalTestCase.csv`) ready | Yes |

---

## Exit Criteria

| Criterion | Required |
|-----------|----------|
| UI AC1, UI AC2, API AC1, API AC2 passed with evidence | Yes |
| Double Confirm validated on UI checkout | Yes |
| Smoke and regression suites executed (manual + UI + API) | Yes |
| All automated tests show **Passed** in execution report | Yes |
| HTML report and screenshots archived in repository | Yes |
| No unresolved Critical or High defects in scoped flows | Yes |
| Public GitHub repository complete with all deliverables | Yes |

---

## Deliverables

| Deliverable | Location / format |
|-------------|-------------------|
| Requirement Analysis | `Requirement-Analysis.md` |
| Risk Analysis | `Risk-Analysis.md` |
| Test Strategy | `Test-Strategy.md` |
| Manual test cases | `FunctionalTestCase.csv` |
| UI + API automation | `PrismStructure/` |
| Execution reports & screenshots | `PrismStructure/reports/`, `PrismStructure/screenshots/` |
| AI prompt history | `ai-prompts/` |
| Project overview & AI workflow | `project-info.md` |
| Setup and run instructions | `readme.md` |
| Public GitHub repository | Assessment portal submission URL |

---

## AI Assisted Testing Strategy

| Activity | AI tool usage |
|----------|---------------|
| **Requirement Analysis** | Cursor AI and ChatGPT used to explore Toolshop flows, structure requirements, and draft `Requirement-Analysis.md` |
| **Risk Analysis** | AI assists risk identification from requirements; output refined into `Risk-Analysis.md` |
| **Test Strategy** | AI supports scope, smoke/regression split, and automation planning in `Test-Strategy.md` |
| **Test Case Design** | AI generates draft rows for `FunctionalTestCase.csv`; coverage validated against FR and risk IDs |
| **Automation Scaffolding** | Cursor AI produces page objects, API clients, and spec file structure under `PrismStructure/` |
| **Debugging** | AI interprets Playwright traces, logs, and API responses to suggest fixes for failing tests |
| **Documentation** | AI drafts `readme.md`, `project-info.md`, and `ai-prompts/` entries |

Every AI-generated output is manually reviewed, corrected, and validated against the live Toolshop application before commit to GitHub.

---

## Success Criteria

| Criterion | Measure |
|-----------|---------|
| **Acceptance criteria met** | UI AC1, UI AC2, API AC1, API AC2 pass on Toolshop environment |
| **Business rules enforced** | Double Confirm, COD-only payment, My Invoices verification demonstrated |
| **Test volume compliant** | 5–8 manual, 5–8 UI, and 5–8 API cases with @Smoke and @Regression tags |
| **Automation quality** | POM structure, separated API layer, reusable utilities, README-run suites |
| **Evidence complete** | Reports, screenshots, and passed status in final execution |
| **Assessment workflow visible** | `project-info.md`, `ai-prompts/`, iterative Git commits |
| **Qualifying score** | Submission meets 70%+ rubric on prompt quality, validation, and engineering approach |

---

*Document: Test Strategy | Application: Practice Software Testing Toolshop | Status: Baseline for Test Design*
