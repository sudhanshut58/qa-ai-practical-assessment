# Test Data Strategy

## Objective

Define how test data is created, managed, and secured for validation of the Practice Software Testing Toolshop across manual testing, Playwright UI automation, and Playwright API automation. This strategy ensures data supports UI AC1, UI AC2, API AC1, and API AC2 while mitigating shared-environment risks (duplicate registration, stale identifiers, token expiry, and data pollution) identified in the project risk register.

---

## Scope

The Toolshop runs on a public shared environment with a pre-seeded product catalog and per-session dynamic identifiers. Test data is required for the following modules:

| Module | Data requirement |
|--------|------------------|
| **Registration** | Valid personal fields, password meeting BR-07, DOB within BR-08 range, unique email per run |
| **Login** | Registered email and password; invalid credential variants for negative tests |
| **Product Search** | Known catalog keywords (e.g. product name fragments from `GET /products`) |
| **Product Filters** | Brand, category, price range, and sort criteria matching live catalog attributes |
| **Product Details** | `product_id` resolved at runtime from listing or filter results |
| **Cart** | Multiple distinct `product_id` values; quantity values for add and update operations |
| **Checkout** | Complete billing address; Cash on Delivery (`cash-on-delivery`) as the only payment method |
| **Invoice** | Valid `cart_id` with line items; COD payload with `payment_details: {}`; invoice verification under My Invoices |
| **Contact Form** | Name, email, subject, and message within API field limits |
| **Logout** | Active session credentials and bearer token to confirm invalidation |
| **API Authentication** | Registration payload, login credentials, runtime bearer token (~120 second lifetime) |
| **API Cart** | `cart_id` from `POST /carts`; product IDs from `GET /products`; quantity update payloads |
| **API Invoice** | COD billing payload chained to authenticated user and populated cart |

---

## Test Data Sources

| Source | Purpose |
|--------|---------|
| **Live Product Catalog** | Provides product names, brands, categories, and price ranges for search, filter, and product detail test data |
| **Runtime API Responses** | Supplies dynamic `product_id`, `cart_id`, bearer tokens, and invoice identifiers chained across API test steps |
| **Factory Methods** | Generates reusable user, billing, and contact payloads with per-run unique values via `PrismStructure/utils/testDataFactory.js` |
| **Swagger API Documentation** | Defines request body schemas, required fields, and validation rules for API payload construction at `api.practicesoftwaretesting.com/api/documentation` |

---

## Test Data Categories

| Category | Contents | Primary use |
|----------|----------|-------------|
| **User Data** | First name, last name, email, password, date of birth, phone | Registration, login, profile verification, logout |
| **Product Data** | Product names, brands, categories, price ranges, sort options, `product_id` | Search, filter, product detail, add-to-cart |
| **Cart Data** | `cart_id`, product line items, quantities, expected totals | Cart UI, API cart chain, checkout prerequisite |
| **Billing Data** | Street, city, state, country code, postal code, `payment_method`, `payment_details` | UI checkout and `POST /invoices` |
| **Contact Form Data** | Name, email, subject, message | UI contact page and `POST /messages` |
| **API Payload Data** | JSON request bodies and expected HTTP status codes (200, 401, 409, 422) | API smoke, regression, and negative contract tests |

---

## Positive Test Data

Data that satisfies business rules and enables successful execution of acceptance criteria flows.

| Area | Positive data |
|------|---------------|
| **Registration** | First name `John`, last name `Doe`, email `testuser+{unique}@example.com`, password `Welcome1!`, DOB `1990-05-15` (age within 18–75), valid phone |
| **Login** | Email and password from a user registered in the same test or setup step |
| **Product Search** | Keyword matching a known catalog item (e.g. `Pliers`, `Hammer`, `Saw`) retrieved during exploratory validation |
| **Product Filters** | Brand, category, price `between` range, and `sort` values confirmed against live `GET /products` response attributes |
| **Product Details** | First available `product_id` from product listing; second distinct `product_id` for multi-item cart scenarios |
| **Cart** | Two or more distinct products; quantity `2` after update to satisfy "multiple products" and quantity-change coverage |
| **Checkout (UI)** | Billing: street `Zoey Shore`, city `Hesselbury`, state `Florida`, country `TG`, postal code `1234AA`; payment method Cash on Delivery |
| **Invoice** | Same billing fields as checkout; `payment_method`: `cash-on-delivery`; `payment_details`: `{}`; non-empty `cart_id` |
| **Contact Form** | Name `QA Tester`, email `contact+{unique}@example.com`, subject `Order inquiry`, message `Testing contact form submission for assessment.` |
| **Favorites** | Authenticated session with valid bearer token; `product_id` from live catalog added via product detail or listing; same `product_id` used to verify removal from Favorites list |
| **Logout** | Authenticated session from preceding login step |
| **API Authentication** | Valid register and login payloads; bearer token extracted from login response for subsequent calls |
| **API Cart** | `POST /carts` → add products via `POST /carts/{id}` → verify via `GET /carts/{cartId}` |
| **API Invoice** | Authenticated `POST /invoices` with assessment billing payload and runtime `cart_id` |

---

## Negative Test Data

Data designed to trigger validation errors and confirm correct rejection behaviour.

| Area | Negative data | Expected outcome |
|------|---------------|------------------|
| **Registration** | Password `short1` (fails BR-07); DOB `2015-01-01` (under 18); duplicate email from prior registration | Field validation error or HTTP 409 |
| **Login** | Unregistered email; correct email with wrong password | Login failure; no bearer token |
| **Product Search** | Keyword with no catalog match (e.g. `zzznomatch999`) | Empty or no-result listing |
| **Product Filters** | Price range excluding all products (e.g. `between=99999,100000`) | Empty filtered result set |
| **Cart** | Checkout or invoice attempt with empty cart | Blocked checkout or HTTP 422 |
| **Checkout (UI)** | Single Confirm click only (BR-01 negative) | Invoice not generated |
| **Invoice (API)** | Missing `billing_street`; `payment_method` other than `cash-on-delivery`; `payment_details` with card fields for COD | HTTP 422 |
| **Contact Form** | Empty required fields; message exceeding max length | UI validation error or API rejection |
| **API Authentication** | `POST /invoices` or `GET /invoices` without Bearer token; request after logout | HTTP 401 |
| **API Cart** | Invoice with invalid or non-existent `cart_id` | HTTP 422 or error response |
| **API Invoice** | `POST /invoices` using another user's `cart_id` | Rejected or inaccessible |

---

## Boundary Test Data

Data at rule limits to confirm inclusive/exclusive boundary handling.

| Field / rule | Boundary values |
|--------------|-----------------|
| **Password (BR-07)** | Exactly 8 characters with all required classes: `Passw0rd!`; 7 characters missing symbol: `Passw0rd` |
| **Date of birth (BR-08)** | DOB yielding age 18 (lower bound); DOB yielding age 75 (upper bound); DOB yielding age 17 (below bound) |
| **Cart quantity** | Quantity `1` (minimum meaningful); quantity `99` or maximum accepted by UI controls |
| **Product filter price** | `between` with minimum catalog price as lower bound; narrow range containing exactly one product |
| **Contact name** | Single-character name; maximum allowed length per API schema |
| **Contact subject / message** | Empty string (negative); string at documented max length (positive boundary) |
| **Billing postal code** | Assessment value `1234AA` (known valid); empty postal code (negative) |
| **Email format** | Valid `user+tag@example.com`; missing `@` domain (negative) |

---

## Dynamic Test Data Strategy

Runtime-generated values prevent collisions on the shared Toolshop environment and eliminate dependency on hard-coded identifiers that may become stale.

| Dynamic value | Generation approach |
|---------------|---------------------|
| **Unique email addresses** | `testuser+{timestamp}{random4}@example.com` via `testDataFactory.js`; new email per registration test and per parallel worker |
| **Dynamic `cart_id`** | Extracted from `POST /carts` response body; passed to add-item, get-cart, and invoice steps within the same test |
| **Dynamic `product_id`** | Selected from `GET /products` response at test runtime (first and second distinct IDs); filter tests use IDs returned by filtered query |
| **Runtime invoice IDs** | Captured from `POST /invoices` response or first row on My Invoices page; used for `GET /invoices` verification |
| **Timestamp-based values** | `Date.now()` or ISO timestamp suffix on emails and contact subjects (e.g. `Order inquiry {timestamp}`) to distinguish submissions |
| **Bearer token** | Obtained via `POST /users/login` immediately before protected operations; not persisted across test files |

**Chaining pattern (API AC2):**

```
Register → Login (token) → GET /products (product_id)
→ POST /carts (cart_id) → POST /carts/{id} (add items)
→ GET /carts/{cartId} (verify) → POST /invoices (invoice)
→ GET /invoices (verify)
```

UI purchase flows follow the same principle: login immediately before checkout to remain within the ~120 second token window (NFR-06).

---

## Test Data Management

| Principle | Application |
|-----------|-------------|
| **Static vs dynamic** | Static: valid password template, assessment billing address, filter criteria discovered during exploratory testing. Dynamic: emails, `cart_id`, `product_id`, tokens, invoice references |
| **Reusable test data** | Password builder, billing payload template, and contact message templates stored in `testDataFactory.js`; only uniqueness-sensitive fields generated per run |
| **Data isolation** | Each automated test registers its own user; no shared login accounts across parallel or serial runs |
| **Shared environment considerations** | Pre-seeded catalog is read-only for testers; user accounts and carts accumulate on the public host — isolation via unique users, not deletion of shared catalog data |

Manual test cases document the data values used per step in `FunctionalTestCase.csv`. Automated tests source values from factory functions and API responses, not inline literals for identifiers.

---

## Test Data Security

| Control | Implementation |
|---------|----------------|
| **No credentials in Git** | Passwords defined in factory code as test-only values; live bearer tokens never written to source files, reports committed to repo, or screenshots |
| **Environment variables** | Base URLs (`UI_BASE_URL`, `API_BASE_URL`) and optional override password loaded via `env.js` and `.env` (listed in `.gitignore`) |
| **Sensitive data handling** | Registration uses disposable `@example.com` addresses; no real personal data; billing address uses assessment sample only |
| **Token management** | Tokens held in Playwright test context or local variables for the duration of a single test; cleared on logout step or test teardown; API request helpers inject `Authorization: Bearer {token}` at call time |

---

## Data Cleanup Strategy

The Toolshop public environment does not expose user or cart deletion APIs for customer accounts. Cleanup is therefore **preventive**, not destructive.

| Approach | Detail |
|----------|--------|
| **Unique users per run** | Avoids duplicate-email failures (BR-12, RK-TD-03) without requiring post-test deletion |
| **Self-contained carts** | Each test creates its own `cart_id`; no dependency on carts from prior runs |
| **No catalog mutation** | Tests read product data only; no create/update/delete of catalog items |
| **Contact submissions** | Timestamped subjects distinguish entries; volume kept minimal within 5–8 case limit |
| **Invoice records** | Invoices persist on shared environment; tests assert creation and content, not removal |
| **Logout in teardown** | Logout step or `GET /users/logout` invalidates session token, reducing risk of token leakage in subsequent steps |

This approach limits pollution impact on other testers while keeping tests repeatable on the shared host.

---

## AI Assisted Test Data Generation

| Activity | Tool | Output |
|----------|------|--------|
| **Positive test data** | ChatGPT drafts registration, billing, and contact payloads aligned to BR-07, BR-08, and COD invoice schema | Rows in `FunctionalTestCase.csv`; factory function templates in `testDataFactory.js` |
| **Negative test data** | Cursor AI proposes invalid password, DOB, empty billing, and missing-token scenarios mapped to risk IDs (RK-TD-01, RK-API-01, RK-API-02) | Negative case data columns and API assertion expectations |
| **Boundary test data** | ChatGPT generates edge-case values at password length, age limits, and field max lengths | Boundary rows tagged @Regression in manual and automated suites |
| **API payloads** | Cursor AI scaffolds JSON bodies for register, login, cart add, and invoice POST from Swagger documentation | Payload objects in API client helpers under `PrismStructure/` |

Prompts reference live Toolshop field names, endpoint paths, and business rules from the baselined requirement and risk documents. **Every AI-generated dataset is manually reviewed** against the live application and Swagger schema before use in test cases or automation code.

---

## Test Data Best Practices

- Prefer dynamic data over hard-coded values for identifiers such as `product_id`, `cart_id`, and email addresses.
- Generate unique users for every test execution to avoid duplicate-registration failures on the shared environment.
- Reuse common payload builders from factory methods rather than duplicating JSON bodies across test files.
- Never commit credentials, bearer tokens, or live session data to Git or execution artefacts.
- Keep test data independent so each test can run in isolation without relying on state from a prior test.
- Validate test data against live Toolshop behaviour and Swagger schemas before execution.

---

## Test Data Versioning

Test data templates, API payloads, factory methods, and reusable datasets are maintained alongside the Playwright automation framework under `PrismStructure/`. Changes to data builders or payload structures are committed to the `qa-ai-practical-assessment` Git repository in step with automation code updates. Version history is tracked through Git commits, ensuring test data and test scripts remain aligned across manual, UI, and API layers.

---

## Deliverables

| Deliverable | Description |
|-------------|-------------|
| **Test-Data-Strategy.md** | This document — baseline for test design and automation data setup |
| **Reusable test data templates** | Standardised user, product, cart, and billing data patterns for manual and automated tests |
| **Dynamic user generation strategy** | Unique email and credential generation approach for shared-environment isolation |
| **API payload templates** | Register, login, cart, and invoice JSON structures aligned to Swagger schemas |
| **Billing payload examples** | Assessment COD billing sample (`Zoey Shore`, `Hesselbury`, `Florida`, `TG`, `1234AA`, `payment_details: {}`) |
| **Contact form sample data** | Valid name, email, subject, and message values within API field limits |
| **Runtime test data generation documentation** | Chaining rules for dynamic `product_id`, `cart_id`, tokens, and invoice IDs from live API responses |

---

*Document: Test Data Strategy | Application: Practice Software Testing Toolshop*

Status: Draft for Review

Version: 1.0
