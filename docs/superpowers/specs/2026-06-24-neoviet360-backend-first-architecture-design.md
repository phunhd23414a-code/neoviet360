# Neoviet360 Backend-First Architecture Design

Date: 2026-06-24  
Project: `neoviet360`  
Status: Draft approved for planning transition  
Priority: Architecture correctness over short-term speed

---

## 1. Executive Summary

`neoviet360` is currently in a hybrid transitional state:

- the frontend still relies heavily on `data/*.json`, local state, and localStorage-driven behavior
- the backend already exposes real application capabilities for auth, accounts, transactions, transfer, payments, and related integrations
- multiple UI surfaces are not consistently bound to backend state

This creates an unstable architectural model where the application appears integrated but still behaves like a mock-first system in several critical paths.

The target architecture is a **backend-first, domain-structured application** where:

- backend is the source of truth
- frontend is responsible for rendering, orchestration, lightweight caching, and user interaction
- core flows no longer depend on mock JSON
- data contracts are explicit and testable
- module boundaries are clear enough for long-term maintenance

This document defines the target design and the official phase-based remediation path.

---

## 2. Current Problems

## 2.1 Hybrid data architecture

The codebase contains three overlapping data sources:

1. static mock JSON in `data/*.json`
2. browser-side persisted/local state
3. backend API responses

Because these sources are mixed by feature and page, the system does not have a single authoritative truth for user-facing financial data.

## 2.2 Observable consequences

This leads to the following concrete problems:

- transfers or payments may succeed in backend flows but not fully update the UI
- dashboard, activity, analytics, or insights may display stale or synthetic data
- localStorage can outlive backend mutations and surface incorrect values
- debugging becomes slow because failures can originate from adapter logic, page logic, mock fallback logic, or backend responses
- test coverage is fragmented and not anchored to a clear data contract

## 2.3 Structural maintainability issues

The project is also difficult to extend safely because:

- business logic is distributed across pages, utilities, and feature files
- frontend domain boundaries are not explicit
- backend route/controller structure exists, but cross-layer contracts are not fully standardized
- deployment/runtime behavior is sensitive to config, CORS, cache, and service worker interactions

---

## 3. Product and Engineering Goal

The objective is not to patch isolated bugs.

The objective is to move `neoviet360` from a **mock-first prototype architecture** into a **backend-first production-style architecture**.

Success means all of the following are true:

1. core business flows use backend APIs as the primary truth source
2. frontend state is derived from backend data, not local mock data
3. domain contracts are explicit and consistent
4. analytics and insights are derived from real transaction/account data
5. tests verify contracts and end-to-end synchronization behavior
6. the codebase is progressively reorganized around domain boundaries

---

## 4. Design Principles

The following principles govern all future implementation:

### 4.1 Backend is authoritative

For production-like flows, the backend owns:

- authentication truth
- account balances
- transaction history
- transfer side effects
- payment side effects
- normalized domain responses

Frontend must not invent or preserve conflicting parallel truths.

### 4.2 Frontend is orchestration and presentation

Frontend owns:

- view rendering
- loading/error/empty states
- lightweight UX cache when explicitly allowed
- page composition
- client-side flow orchestration

Frontend must not treat local JSON or localStorage as the primary ledger.

### 4.3 One contract per domain

Each domain must expose stable field names and response conventions.  
The frontend must consume contract-normalized shapes rather than ad hoc endpoint-specific variants.

### 4.4 State updates must be mutation-aware

After a transfer or payment mutation, the system must define how the UI becomes correct again:

- optimistic update with reconciliation, or
- server mutation followed by explicit refresh

Silent drift is not acceptable.

### 4.5 Domain boundaries over file sprawl

The codebase should evolve toward domain-grouped modules rather than mixed utility/page logic scattered across unrelated directories.

### 4.6 Tests must reflect real architecture

Tests must verify:

- contract correctness
- synchronization after mutations
- app startup/bootstrap correctness
- deployment-sensitive config behavior

---

## 5. Target Architecture

## 5.1 Frontend target model

Frontend should move toward this responsibility model:

- `pages/` compose domain-backed views
- `components/` remain reusable and mostly presentation-oriented
- `utils/api.js` and `utils/api-adapter.js` form the transport and response-normalization layer
- `utils/state.js` acts as app orchestration state until a more domain-explicit structure is introduced
- domain responsibilities should progressively move into dedicated domain-oriented modules

### Desired future frontend structure

A likely target shape is:

- `domains/auth/`
- `domains/accounts/`
- `domains/transactions/`
- `domains/payments/`
- `domains/insights/`
- `shared/ui/`
- `shared/lib/`

This is a long-term target, not the first migration step.

## 5.2 Backend target model

Backend should remain authoritative and become more explicitly layered:

- routes define API surface
- controllers handle request/response orchestration
- services encapsulate business logic
- repositories/data access isolate persistence
- middleware handles auth and errors consistently
- validation/schema rules enforce contract quality

The backend should produce normalized shapes so frontend adapters remain thin and predictable.

---

## 6. Domain Contract Design

The following domains must be standardized before broad integration work proceeds:

## 6.1 Auth

Must define:

- login request/response
- token/session behavior
- current user shape
- auth failure format
- logout/session invalidation expectations

## 6.2 Accounts

Must define:

- account identity
- display name
- balance and available balance conventions
- currency semantics
- account type/status

## 6.3 Transactions

Must define a normalized transaction shape including at minimum:

- `id`
- `amount`
- `currency`
- `status`
- `type`
- `category`
- `description`
- `merchant` or equivalent source label
- `createdAt`

If backend internally stores more fields, adapters may enrich the client shape, but the canonical display contract must stay consistent.

## 6.4 Transfers

Must define:

- request payload
- success response
- resulting account state expectations
- resulting transaction visibility expectations
- failure modes and validation errors

## 6.5 Payments

Must define shared mutation semantics across:

- topup
- bill pay
- scheduled payments
- split bill
- e-wallet payments
- QR payments

Not every flow must be equally “real” at first, but every flow must conform to a consistent contract strategy.

## 6.6 Error envelope

A standard error shape should be used across backend APIs, ideally with:

- `message`
- `code`
- `details`

This prevents page-level error branching from exploding across the frontend.

---

## 7. Data Flow Design

## 7.1 App bootstrap

At application start, the frontend must define a deterministic data load path:

1. detect auth/session
2. load user identity if authenticated
3. load accounts
4. load transactions
5. derive dashboard and activity state from those canonical domain datasets

Bootstrap must not blend mock JSON into authenticated production-like flows.

## 7.2 Mutation flow

For transfers and payments, the required sequence is:

1. submit mutation to backend
2. receive normalized mutation result
3. refresh or reconcile affected accounts
4. refresh or reconcile affected transactions
5. update dependent views such as dashboard, activity, and insight summaries

The app must not assume UI correctness merely because the mutation endpoint returned success.

## 7.3 Analytics flow

Analytics and insight features must consume:

- canonical transaction data
- canonical account data
- deterministic derived calculations

Derived metrics should not read directly from legacy mock sources once the migration is complete.

## 7.4 Local persistence policy

localStorage may be used only for:

- session persistence if explicitly designed
- non-authoritative UX settings
- lightweight cache with clear invalidation rules

localStorage must not remain the ledger for balances, transactions, or post-mutation correctness.

---

## 8. Phase Plan

## Phase 0 — Baseline audit and scope freeze

### Goal
Establish a precise map of current architecture and integration drift.

### Work
- audit all core flows:
  - login
  - accounts
  - transactions
  - transfer
  - payments
  - dashboard
  - activity
  - insights
- identify which files consume:
  - mock JSON
  - localStorage
  - backend APIs
- map current source of truth by domain
- record frontend/backend mismatch points
- freeze the initial remediation scope to core production-like flows

### Deliverables
- domain-by-domain source-of-truth inventory
- mismatch inventory
- impacted file map

### Exit criteria
The team can point to the exact truth source and integration path for every core domain.

---

## Phase 1 — Contract standardization

### Goal
Define stable contracts before broad refactoring.

### Work
- standardize domain response shapes
- align naming across frontend and backend
- normalize auth/account/transaction/transfer/payment contracts
- define shared error envelope
- define adapter responsibilities explicitly

### Deliverables
- official domain contract map
- frontend adapter mapping rules

### Exit criteria
No major integration path is blocked by shape ambiguity.

---

## Phase 2 — Frontend data-layer redesign

### Goal
Create one coherent frontend data path before migrating all UI surfaces.

### Work
- clarify responsibilities in `utils/state.js`
- separate bootstrap loading from post-mutation refresh logic
- reduce direct page coupling to mock/static data
- define cache and invalidation behavior
- make refresh logic explicit after transfer/payment success

### Deliverables
- frontend data-flow design
- state responsibility breakdown
- mutation synchronization strategy

### Exit criteria
Pages no longer own fragmented private data-loading behaviors for core flows.

---

## Phase 3 — Core read-domain integration

### Goal
Integrate auth, accounts, and transactions as the first stable backend-first slice.

### Work
- make login consistently backend-driven
- load accounts from backend
- load transactions from backend
- drive dashboard and activity from synchronized canonical state
- normalize loading/error/empty-state behavior

### Affected areas
- `pages/LoginPage.js`
- `pages/DashboardPage.js`
- `pages/ActivityPage.js`
- `utils/auth.js`
- `utils/state.js`
- `utils/api.js`
- `utils/api-adapter.js`
- related shared header/session components

### Deliverables
- backend-first login/bootstrap
- activity and dashboard driven by canonical state

### Exit criteria
Authenticated core read flows no longer require legacy transaction/account mock datasets.

---

## Phase 4 — Mutation-domain integration

### Goal
Make all financial-changing actions synchronize reliably with backend truth.

### Work
- integrate transfer mutation lifecycle
- integrate payment mutation lifecycle for:
  - topup
  - bill pay
  - scheduled
  - split bill
  - e-wallet
  - QR pay
- define which flows are real vs simulated but contract-compliant
- ensure UI refresh/reconciliation after each mutation
- ensure failure handling does not leave UI in a false-success state

### Affected areas
- `banking/transfer.js`
- `payment/*.js`
- transfer/payment backend routes/controllers
- dashboard/activity synchronization hooks

### Deliverables
- mutation synchronization strategy
- consistent post-mutation refresh behavior

### Exit criteria
A successful mutation always produces a correct user-visible state.

---

## Phase 5 — Analytics and insight correctness

### Goal
Ensure all derived insights use real synchronized domain data.

### Work
- audit analytics and AI-related modules
- separate raw domain data from derived metrics
- create deterministic selector/aggregation responsibilities
- define fallback behavior for incomplete real data
- eliminate dependencies on legacy mock assumptions

### Affected areas
- `utils/aiAnalytics.js`
- `utils/advancedAnalytics.js`
- `analytics/spending.js`
- `pages/InsightsPage.js`
- `pages/CarbonPage.js`
- `components/AICoachModal.js`

### Deliverables
- derived metrics pipeline based on canonical data
- aligned insight behavior across pages

### Exit criteria
Insight values do not conflict across screens and are derived from real integrated data.

---

## Phase 6 — Domain/module refactor

### Goal
Restructure the codebase for long-term maintainability.

### Work
- progressively organize code by domain
- move domain-specific orchestration away from generic utility sprawl
- separate shared UI from domain logic
- reduce cross-feature coupling

### Deliverables
- clearer module boundaries
- dependency direction documentation
- improved navigability for maintenance

### Exit criteria
Engineers can reason about behavior by domain rather than tracing logic across unrelated directories.

---

## Phase 7 — Test architecture and execution model

### Goal
Make verification repeatable and architecture-aligned.

### Work
- establish consistent root-level or orchestrated run/test scripts
- standardize backend test execution
- preserve and expand frontend contract tests
- add smoke coverage for:
  - login
  - dashboard bootstrap
  - transfer
  - payments
  - activity synchronization
- ensure tests verify synchronization, not just isolated function calls

### Deliverables
- test command strategy
- minimum regression suite for core flows
- clearer developer verification workflow

### Exit criteria
Critical architectural changes can be verified without relying on ad hoc manual checks only.

---

## Phase 8 — Deployment, config, and runtime reliability

### Goal
Prevent runtime drift caused by config and environment inconsistencies.

### Work
- standardize API base URL handling
- standardize environment/config behavior
- validate CORS strategy
- validate service worker/cache strategy
- review deployment configuration such as `vercel.json`
- improve backend runtime logging and error visibility
- document environment matrix and deployment checklist

### Deliverables
- deployment checklist
- env/config matrix
- cache/CORS/API URL strategy

### Exit criteria
Production-like deployment is reproducible and does not rely on tribal knowledge.

---

## Phase 9 — UAT, stabilization, and cleanup

### Goal
Close the migration by removing drift and validating real user flows.

### Work
- run UAT on all core flows
- remove obsolete mock dependencies from core paths
- remove compatibility hacks no longer needed
- update project documentation
- produce stabilization summary

### Deliverables
- UAT checklist
- cleanup report
- release readiness summary

### Exit criteria
Core production-like paths are backend-first, stable, and free from misleading legacy mock behavior.

---

## 9. Prioritization

## 9.1 Mandatory early phases

The highest-value sequence is:

1. Phase 0
2. Phase 1
3. Phase 2
4. Phase 3
5. Phase 4

This sequence establishes truth, then integrates read paths, then mutation paths.

## 9.2 Reliability phases

Next priority:

6. Phase 5
7. Phase 7
8. Phase 8

These phases make the system trustworthy and deployable.

## 9.3 Long-term maintainability phases

Then:

9. Phase 6
10. Phase 9

Domain refactor should proceed with discipline after the data architecture is stable enough to avoid expensive rework.

---

## 10. Risks and Mitigations

## 10.1 Contract drift

### Risk
Frontend and backend evolve different shapes over time.

### Mitigation
- explicit contract documentation
- adapter normalization rules
- contract tests

## 10.2 UI breakage during truth-source migration

### Risk
Moving from mock data to backend data breaks screens that implicitly depended on mock assumptions.

### Mitigation
- migrate by domain
- keep smoke verification for each phase
- validate loading/error/empty state behavior explicitly

## 10.3 localStorage ghost state

### Risk
Persisted local data continues to override or confuse fresh backend state.

### Mitigation
- restrict localStorage responsibilities
- define invalidation strategy
- prefer backend refresh after mutations

## 10.4 Analytics inconsistency

### Risk
Derived features remain tied to old mock field assumptions.

### Mitigation
- create explicit raw-to-derived selectors
- verify key metrics on multiple screens
- treat analytics as a downstream consumer of canonical data

## 10.5 Premature structural refactor

### Risk
Reorganizing directories before stabilizing data flows creates large rework.

### Mitigation
- prioritize contracts and data flow first
- perform domain/module refactor after core integration stabilizes

---

## 11. Definition of Done

The architecture transition is considered successful when:

1. login, accounts, transactions, transfer, and payments operate through backend truth
2. dashboard, activity, and insights derive from synchronized canonical data
3. mock JSON is no longer required for core production-like flows
4. localStorage is no longer a source of truth for financial state
5. frontend/backend contracts are explicit and standardized
6. test commands exist for reliable verification
7. deployment/runtime config is documented and reproducible
8. code structure is sufficiently domain-oriented for long-term maintenance

---

## 12. Recommended Execution Program

The implementation should be treated as three major programs:

### Program A — Data correctness foundation
- Phase 0
- Phase 1
- Phase 2
- Phase 3
- Phase 4

### Program B — Reliability and operations
- Phase 5
- Phase 7
- Phase 8

### Program C — Long-term maintainability
- Phase 6
- Phase 9

This ordering is recommended because it solves correctness first, then trustworthiness, then codebase longevity.

---

## 13. Final Recommendation

The recommended strategy is to begin with a combined foundation effort across:

- Phase 0: baseline audit
- Phase 1: contract standardization
- Phase 2: frontend data-layer redesign

Only after those are explicit and accepted should the team execute end-to-end integration in:

- Phase 3: core read domains
- Phase 4: mutation domains

This is the lowest-rework path that matches the stated goal of architectural correctness over short-term patch speed.