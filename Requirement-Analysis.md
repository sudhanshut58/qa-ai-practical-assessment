# Requirement Analysis

## Project Overview

This document defines the requirements for QA validation of the **Practice Software Testing Toolshop**, an e-commerce web application. The project supports an AI-assisted QA automation assessment using **Playwright (JavaScript)** with separate UI and API test coverage.

The primary objective is to validate customer-facing business flows spanning user account management, product discovery, cart operations, checkout, invoice generation, and post-purchase verification. Testing encompasses manual test cases, UI automation, and API automation with traceability to stated acceptance criteria.

| Item | Detail |
|------|--------|
| Application | Practice Software Testing Toolshop |
| Domain | E-commerce (B2C) |
| UI | https://practicesoftwaretesting.com/ |
| API | https://api.practicesoftwaretesting.com/api/documentation |
| Automation | Playwright, JavaScript, Page Object Model (Prism structure) |
| Test volume | 5–8 test cases per layer (Manual, UI, API), tagged @Smoke or @Regression |

---

## System Under Test

The Toolshop is a practice e-commerce application comprising a browser-based storefront and a REST API backend. The UI consumes API services for authentication, catalog, cart, checkout, and order management.

| Layer | Description |
|-------|-------------|
| **UI** | Single-page web application for product browsing, account management, cart, checkout, and invoice viewing |
| **API** | RESTful services with Bearer token authentication for protected resources |
| **Data** | Shared public environment with pre-seeded catalog data; dynamic user and cart identifiers per session |

---

## Project Scope

### In Scope

| Area | Coverage |
|------|----------|
| User registration, login, logout, and profile verification | UI + API |
| Product browsing and product filtering | UI |
| Shopping cart — add items, update quantity | UI + API |
| Checkout with Cash on Delivery (COD) | UI + API |
| Invoice generation and verification under My Invoices | UI + API |
| Contact form submission | UI + API |
| Smoke and regression test tiers | Manual, UI, API |
| Test execution evidence (reports, screenshots) | All layers |

### Acceptance Criteria (Assessment)

**UI AC1 — User Registration & Login**  
The user shall register with valid details, log in using registered credentials, and verify profile information successfully.

**UI AC2 — End-to-End Purchase Flow**  
The user shall browse products, add multiple items to the cart (including updating quantity), complete checkout using Cash on Delivery, press **Confirm twice** to generate the invoice, and view the invoice under **My Invoices**.

**API AC1 — User Authentication & Cart Creation**  
A new user shall register via API, log in with registered credentials, obtain a valid bearer token, and create a new cart successfully.

**API AC2 — Product Selection & Invoice Generation**  
Using the bearer token, the user shall retrieve products, add selected products to the cart, verify cart contents, and generate an invoice with required customer and order details.

---

## Major Modules

| Module | Responsibilities | Project relevance |
|--------|------------------|-------------------|
| **User / Authentication** | Registration, login, logout, profile, session token management | Core |
| **Product Catalog** | Product listing, search, filtering by brand/category/price, product detail | Core |
| **Shopping Cart** | Create cart, add items, update quantity, view cart | Core |
| **Checkout & Billing** | Billing address entry, payment method selection | Core |
| **Invoice / Orders** | Invoice creation, My Invoices listing, order details | Core |
| **Favorites** | Save and manage wishlist products for authenticated users | Supporting |
| **Contact** | Submit contact/support messages | Supporting |
| **Session / State** | Token persistence, cart state, navigation between modules | Cross-cutting |

---

## User Roles

| Role | Description | Testing scope |
|------|-------------|---------------|
| **Guest** | Unauthenticated visitor | Product browse and filter only |
| **Customer (user)** | Registered shopper | All in-scope functional flows |
| **Admin** | Store administrator | Out of scope |

All test design and execution target the **Customer** role unless explicitly testing unauthenticated behaviour.

---

## Business Flows

### BF-01 — Customer Onboarding (UI AC1)

```
Register → Login → View Profile → Verify profile data
```

### BF-02 — End-to-End Purchase (UI AC2)

```
Login → Browse Products → Add Multiple Products → Update Quantity
→ Checkout → Enter Billing → Select Cash on Delivery
→ Confirm (1st) → Confirm (2nd) → My Invoices → Verify Invoice
```

### BF-03 — API Authentication & Cart (API AC1)

```
Register → Login → Obtain Bearer Token → Create Cart
```

### BF-04 — API Purchase (API AC2)

```
Login → Get Products → Add to Cart → Verify Cart → Generate Invoice (COD)
```

### BF-05 — Product Filter

```
Login → Navigate to Products → Apply Filter (brand / category / price / sort)
→ Verify filtered results match selected criteria
```

### BF-06 — Contact Form

```
Navigate to Contact → Complete form (name, email, subject, message) → Submit
→ Verify success confirmation
```

### BF-07 — Logout

```
Login → Perform authenticated action → Logout → Verify session terminated
→ Verify protected pages require re-authentication
```

---

## Functional Requirements

### User & Authentication

| ID | Requirement | Layer |
|----|-------------|-------|
| FR-01 | User can register with valid personal and credential data | UI, API |
| FR-02 | User can log in with registered email and password | UI, API |
| FR-03 | User can view profile information after login | UI, API |
| FR-04 | Profile data is consistent with registration details | UI |
| FR-05 | User can log out and session is invalidated | UI, API |
| FR-06 | Protected resources are inaccessible without valid authentication | API |

### Product Catalog & Filter

| ID | Requirement | Layer |
|----|-------------|-------|
| FR-07 | User can view product listing | UI, API |
| FR-08 | User can filter products by brand, category, price range, or sort order | UI, API |
| FR-09 | Filtered results reflect applied criteria | UI |

### Shopping Cart

| ID | Requirement | Layer |
|----|-------------|-------|
| FR-10 | User can add multiple distinct products to cart | UI, API |
| FR-11 | User can update product quantity in cart | UI, API |
| FR-12 | Cart contents reflect added products and quantities | UI, API |

### Checkout & Invoice

| ID | Requirement | Layer |
|----|-------------|-------|
| FR-13 | User can proceed to checkout with items in cart | UI |
| FR-14 | User can complete checkout using Cash on Delivery | UI, API |
| FR-15 | Invoice generation requires Confirm button to be pressed **twice** on UI | UI |
| FR-16 | Generated invoice is visible under My Invoices | UI, API |
| FR-17 | Invoice contains correct billing and line-item details | UI, API |

### Contact

| ID | Requirement | Layer |
|----|-------------|-------|
| FR-18 | User can submit a contact form with required fields | UI, API |
| FR-19 | Successful submission returns confirmation to the user | UI |

---

## Non-Functional Requirements

| ID | Requirement | Notes |
|----|-------------|-------|
| NFR-01 | Application availability | Public hosted environment; basic reachability required before test execution |
| NFR-02 | Authentication security | Bearer tokens must not be stored in source control or committed artifacts |
| NFR-03 | Test data isolation | Unique user credentials per test execution on shared environment |
| NFR-04 | Automation maintainability | UI and API layers separated; Page Object Model applied |
| NFR-05 | Execution reproducibility | All automated suites runnable from README without manual steps beyond environment setup |
| NFR-06 | Token lifetime | Access tokens expire (~120 seconds); test flows must complete within valid session or refresh token |

---

## Business Rules

| ID | Rule |
|----|------|
| BR-01 | Invoice generation on UI requires the Confirm button to be pressed **two times** |
| BR-02 | Post-purchase invoice verification is performed under **My Invoices** |
| BR-03 | Assessment payment method is **cash-on-delivery** only |
| BR-04 | COD invoice payload uses `"payment_details": {}` |
| BR-05 | Invoice creation requires a valid `cart_id` containing one or more items |
| BR-06 | Invoice API operations require a valid Bearer token |
| BR-07 | Password must be minimum 8 characters with uppercase, lowercase, number, and symbol |
| BR-08 | Date of birth must represent an age between 18 and 75 years |
| BR-09 | Adding the same product to cart updates quantity rather than creating a duplicate line |
| BR-10 | Authenticated users can view only their own invoices |
| BR-11 | All billing address fields are mandatory for invoice creation |
| BR-12 | Duplicate email registration returns HTTP 409 |

---

## Assumptions

| ID | Assumption |
|----|------------|
| A-01 | Target environment URLs are `practicesoftwaretesting.com` (UI) and `api.practicesoftwaretesting.com` (API) |
| A-02 | Purchase and My Invoices flows require an authenticated customer session |
| A-03 | "Multiple products" means two or more distinct products |
| A-04 | Double Confirm applies to the UI checkout flow only; API invoice uses a single POST request |
| A-05 | Each test execution uses dynamically generated unique user email addresses |
| A-06 | Assessment-provided billing data is valid for UI and API invoice submission |
| A-07 | All submitted automated tests achieve Passed status at time of submission |
| A-08 | Test case count per layer remains within 5–8 cases including @Smoke and @Regression tags |

---

## Dependencies

```
Registration / Login
        │
        ▼
  Bearer Token ──────────────────────────┐
        │                                │
        ▼                                ▼
   Profile / Logout              Product Catalog
                                        │
                                        ▼
                                  Product Filter
                                        │
                                        ▼
                                   Shopping Cart
                                        │
                          ┌─────────────┴─────────────┐
                          ▼                           ▼
                      Checkout                   Contact Form
                          │
                          ▼
                   Confirm (×2) ──► Invoice
                          │
                          ▼
                     My Invoices
```

| Dependency | Description |
|------------|-------------|
| Auth → Protected APIs | Cart, invoice, and profile operations require valid Bearer token |
| Catalog → Cart | Valid `product_id` required from product listing or filter results |
| Cart → Invoice | Non-empty cart with valid `cart_id` required before invoice creation |
| Cart state → Invoice totals | Final quantities must be reflected in invoice line items |
| Session → Logout | Logout invalidates token; subsequent protected access must fail |
| UI ↔ API | UI actions invoke corresponding API endpoints; results must remain consistent |

---

## API Components

| Capability | Endpoint | Method | Auth |
|------------|----------|--------|------|
| **Register** | `/users/register` | POST | No |
| **Login** | `/users/login` | POST | No |
| **Profile** | `/users/me` | GET | Bearer |
| **Logout** | `/users/logout` | GET | Bearer |
| **Products** | `/products` | GET | No |
| **Create Cart** | `/carts` | POST | No |
| **Add to Cart** | `/carts/{id}` | POST | No |
| **Get Cart** | `/carts/{cartId}` | GET | No |
| **Update Cart** | `/carts/{cartId}/product/quantity` | PUT | No |
| **Generate Invoice** | `/invoices` | POST | Bearer |
| **My Invoices** | `/invoices` | GET | Bearer |
| **Contact Form** | `/messages` | POST | No |

### Invoice Request Payload (COD)

```json
{
  "billing_street": "Zoey Shore",
  "billing_city": "Hesselbury",
  "billing_state": "Florida",
  "billing_country": "TG",
  "billing_postal_code": "1234AA",
  "payment_method": "cash-on-delivery",
  "cart_id": "<dynamic>",
  "payment_details": {}
}
```

---

## Out of Scope

| Item | Reason |
|------|--------|
| Admin role and admin-only operations | Not part of customer acceptance criteria |
| Reports (`/reports/*`) | Admin functionality |
| TOTP / two-factor authentication | Not in assessment flows |
| Guest checkout (`/invoices/guest`) | Not in stated acceptance criteria |
| Payment methods other than Cash on Delivery | Assessment specifies COD only |
| Invoice PDF download | Not required for invoice verification |
| Password recovery and change-password flows | Not in core acceptance criteria |
| Cross-browser matrix beyond primary browser | Out of assessment minimum |

---

## Test Objectives

| Objective | Description |
|-----------|-------------|
| **Validate core customer journeys** | Confirm UI AC1, UI AC2, API AC1, and API AC2 execute successfully end to end |
| **Verify business rules** | Ensure double Confirm, COD payment, and My Invoices behaviour conform to stated rules |
| **Establish smoke coverage** | Provide fast-confidence checks for availability and critical happy paths |
| **Establish regression coverage** | Cover primary flows plus key negative and edge scenarios within 5–8 cases per layer |
| **Ensure UI/API consistency** | Validate that UI outcomes align with corresponding API responses |
| **Support traceability** | Map requirements and business rules to manual cases, automation scripts, and execution evidence |
| **Deliver maintainable automation** | Implement Playwright UI and API suites using separated layers and reusable components |

---

*Document: Requirement Analysis | Application: Practice Software Testing Toolshop | Status: Baseline for Test Strategy*
