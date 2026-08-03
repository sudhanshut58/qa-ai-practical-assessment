# Requirement Traceability Matrix (RTM)

This matrix establishes traceability between functional requirements, business rules, risks, manual test cases, and planned automation layers. All references use IDs defined in the baselined project documents.

**Source documents:** `Requirement-Analysis.md`, `Risk-Analysis.md`, `Test-Strategy.md`, `Test-Data-Strategy.md`, `FunctionalTestCase/FunctionalTestCases.csv`

---

## Traceability Matrix

| Requirement ID | Requirement Description | Business Rule(s) | Risk ID(s) | Manual Test Case ID | UI Automation Candidate | API Automation Candidate | Priority | Status | Remarks |
|----------------|-------------------------|------------------|------------|---------------------|-------------------------|--------------------------|----------|--------|---------|
| FR-01 | User can register with valid personal and credential data | BR-07, BR-08, BR-12 | RK-API-06, RK-TD-01, RK-TD-02, RK-TD-03 | TC-001 | Yes | Yes | High | Planned | Covered by Smoke; UI + API |
| FR-02 | User can log in with registered email and password | N/A | RK-API-01, RK-EN-04 | TC-001, TC-002 | Yes | Yes | High | Planned | Covered by Smoke; UI + API |
| FR-03 | User can view profile information after login | N/A | RK-API-01 | TC-001 | Yes | Yes | High | Planned | Covered by Smoke; UI + API |
| FR-04 | Profile data is consistent with registration details | N/A | RK-F-06 | TC-001 | Yes | Yes | High | Planned | Covered by Smoke; UI + API |
| FR-05 | User can log out and session is invalidated | N/A | RK-F-07, RK-API-09 | TC-007 | Yes | Yes | High | Planned | Covered by Smoke; UI + API |
| FR-06 | Protected resources are inaccessible without valid authentication | BR-06 | RK-API-01, RK-F-07 | TC-007 | Partial | Yes | High | Planned | Covered by Smoke; negative validation |
| FR-07 | User can view product listing | N/A | RK-F-11, RK-UI-02, RK-UI-03, RK-API-10 | TC-002, TC-003, TC-005 | Yes | Yes | Medium | Planned | Covered by Regression; UI + API |
| FR-08 | User can filter products by brand, category, price range, or sort order | N/A | RK-F-05, RK-UI-02, RK-API-10 | TC-003 | Yes | Yes | Medium | Planned | Covered by Regression; UI + API |
| FR-09 | Filtered results reflect applied criteria | N/A | RK-F-05, RK-UI-02, RK-API-10 | TC-003 | Yes | Partial | Medium | Planned | Covered by Regression; UI + API |
| FR-10 | User can add multiple distinct products to cart | BR-09 | RK-F-09, RK-F-10, RK-API-04, RK-TD-04 | TC-002 | Yes | Yes | High | Planned | Covered by Smoke; UI + API |
| FR-11 | User can update product quantity in cart | BR-09 | RK-F-03, RK-F-09, RK-UI-04, RK-API-05 | TC-002, TC-004 | Yes | Yes | High | Planned | Covered by Smoke and Regression; UI + API |
| FR-12 | Cart contents reflect added products and quantities | BR-09 | RK-F-03, RK-API-04, RK-TD-04 | TC-004 | Yes | Yes | Medium | Planned | Covered by Regression; UI + API |
| FR-13 | User can proceed to checkout with items in cart | BR-05 | RK-F-10, RK-UI-06 | TC-002, TC-008 | Yes | No | Medium | Planned | Covered by Smoke and Regression; negative validation |
| FR-14 | User can complete checkout using Cash on Delivery | BR-03, BR-04, BR-11 | RK-F-04, RK-UI-07, RK-API-02, RK-TD-05 | TC-002 | Yes | Yes | High | Planned | Covered by Smoke; UI + API |
| FR-15 | Invoice generation requires Confirm button to be pressed twice on UI | BR-01 | RK-F-01, RK-UI-01, RK-AU-02 | TC-002 | Yes | No | High | Planned | Covered by Smoke; UI only |
| FR-16 | Generated invoice is visible under My Invoices | BR-02 | RK-F-02, RK-UI-05, RK-API-07 | TC-002 | Yes | Yes | High | Planned | Covered by Smoke; UI + API |
| FR-17 | Invoice contains correct billing and line-item details | BR-04, BR-05, BR-10, BR-11 | RK-F-03, RK-API-02, RK-API-03 | TC-002 | Yes | Yes | High | Planned | Covered by Smoke; UI + API |
| FR-18 | User can submit a contact form with required fields | N/A | RK-F-08, RK-API-08, RK-TD-06 | TC-006 | Yes | Yes | High | Planned | Covered by Regression; UI + API |
| FR-19 | Successful submission returns confirmation to the user | N/A | RK-F-08 | TC-006 | Yes | Partial | High | Planned | Covered by Regression; UI + API |

---

## Traceability Flow

```
Requirement
    ↓
Business Rule
    ↓
Risk
    ↓
Manual Test Case
    ↓
Automation
```

Each functional requirement (FR-01–FR-19) traces forward through applicable business rules (BR-01–BR-12), mapped risk IDs from the risk register, manual test cases in `FunctionalTestCase/FunctionalTestCases.csv` (TC-001–TC-008), and planned UI and API automation candidates aligned to the Test Strategy and available API endpoints.

---

## Coverage Summary

| Metric | Value |
|--------|-------|
| Total Functional Requirements | 19 |
| Requirements Covered | 19 |
| Manual Test Cases | 8 |
| UI Automation Candidates | 19 (18 Yes, 1 Partial) |
| API Automation Candidates | 19 (15 Yes, 2 Partial, 2 No) |
| Coverage % | 100% |

All 19 in-scope functional requirements are covered by at least one manual test case. Requirements without a direct business rule are marked N/A in the Business Rule(s) column.

---

## Automation Summary

| Category | Count |
|----------|-------|
| UI automation candidates (Yes) | 18 |
| UI automation candidates (Partial) | 1 |
| API automation candidates (Yes) | 15 |
| API automation candidates (Partial) | 2 |
| API automation candidates (No) | 2 |
| Manual only requirements | 0 |

**Notes:**

- FR-06 UI automation is Partial — protected-access validation is primarily API-driven; TC-007 covers UI redirect behaviour after logout.
- FR-09 API automation is Partial — filtered result correctness is validated via `GET /products` query parameters; full criteria alignment is confirmed on UI.
- FR-13 has no direct API equivalent for checkout navigation; cart readiness is validated via API cart endpoints in separate flows.
- FR-15 is UI-only per BR-01 and assumption A-04; API invoice uses a single `POST /invoices` request.
- FR-19 API automation is Partial — `POST /messages` confirms submission; UI confirmation message is validated on the Contact page.

---

## RTM Maintenance

- Update the RTM whenever Functional Requirements change.
- Add new traceability links when new manual or automation tests are created.
- Ensure every Functional Requirement remains linked to at least one validation artifact.

---

*Document: Requirement Traceability Matrix | Application: Practice Software Testing Toolshop | Status: Planned*
