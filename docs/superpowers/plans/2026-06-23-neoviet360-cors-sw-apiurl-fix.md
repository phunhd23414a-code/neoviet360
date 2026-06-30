# NeoViet360 CORS + Service Worker + API URL Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sửa đồng bộ lỗi preflight/CORS, service worker intercept API request, và frontend resolve API base URL sai nguồn để login và các API calls hoạt động ổn định ở local lẫn deployment.

**Architecture:** Backend sẽ dùng một CORS policy thống nhất cho cả actual requests lẫn preflight requests. Frontend sẽ giới hạn service worker chỉ cache static same-origin assets, đồng thời chuẩn hóa thứ tự resolve API base URL từ `window.ENV`, `window.CONFIG`, rồi fallback cuối. Verification bám vào test CORS hiện có và các kiểm tra syntax/runtime nhỏ gọn.

**Tech Stack:** Node.js, Express, cors, browser service worker, vanilla JavaScript, custom Node test scripts

## Global Constraints

- Không refactor toàn bộ kiến trúc config frontend/backend.
- Không thay đổi business logic auth/login ngoài phạm vi CORS/API URL.
- Backend phải luôn cho phép các origin local phổ biến: `http://127.0.0.1:5500`, `http://localhost:5500`.
- Backend phải hỗ trợ bổ sung origin qua env.
- Preflight phải được xử lý bằng cùng một CORS policy dùng cho actual requests.
- Service worker chỉ cache static assets cùng origin.
- Service worker không được intercept request tới `/api` hoặc cross-origin backend requests.
- Frontend API base URL phải resolve theo thứ tự: `window.ENV.API_URL` → `window.CONFIG.API_BASE` → fallback cuối.
- Giá trị API base URL phải được normalize để bỏ dấu `/` ở cuối.
- Verification phải nêu rõ phần verify local và phần cần redeploy để có hiệu lực production.

---

### Task 1: Harden backend CORS policy and preflight handling

**Files:**
- Modify: `neoviet360-backend/src/app.js`
- Test: `tests/cors-origin.test.js`

**Interfaces:**
- Consumes: Express app exported from `neoviet360-backend/src/app.js`
- Produces:
  - unified CORS middleware mounted in `app`
  - preflight response for `OPTIONS /api/auth/login`
  - allowlist behavior for `http://127.0.0.1:5500` and `http://localhost:5500`

- [ ] **Step 1: Write the failing test expectation review**

Use existing test target and confirm the expected behavior remains:

```js
const allowOrigin = res.headers["access-control-allow-origin"];
const isValid =
  res.statusCode === 204 &&
  allowOrigin === "http://127.0.0.1:5500";
```

This task does not require a new test file because `tests/cors-origin.test.js` already captures the main regression.

- [ ] **Step 2: Run test to verify current behavior before changes**

Run: `node tests/cors-origin.test.js`

Expected: Either PASS already, or fail/non-deterministic behavior if preflight policy differs from actual request policy. Capture the output for comparison after the fix.

- [ ] **Step 3: Write minimal implementation in `neoviet360-backend/src/app.js`**

Replace the loose allowlist/preflight setup with one shared policy:

```js
const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
];

const configuredOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...configuredOrigins])];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (process.env.ALLOW_ALL_ORIGINS === "true") {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked for origin: ${origin}`);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("/api/*", cors(corsOptions));
```

Also remove the old code:

```js
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5500,http://127.0.0.1:5500")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (process.env.NODE_ENV !== "production" || process.env.ALLOW_ALL_ORIGINS === "true") {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`CORS blocked for origin: ${origin}`);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.options("*", cors());
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/cors-origin.test.js`

Expected output contains:

```txt
OPTIONS /api/auth/login status 204
access-control-allow-origin http://127.0.0.1:5500
```

Exit code: `0`

- [ ] **Step 5: Commit**

```bash
git add neoviet360-backend/src/app.js tests/cors-origin.test.js
git commit -m "fix: unify backend cors and preflight handling"
```

### Task 2: Restrict service worker caching to same-origin static assets only

**Files:**
- Modify: `sw.js`

**Interfaces:**
- Consumes:
  - existing `CACHE_NAME`
  - existing `ASSETS` precache list
- Produces:
  - same-origin static cache behavior
  - bypass for non-GET requests
  - bypass for `/api` requests
  - cache cleanup on activate

- [ ] **Step 1: Define the desired behavior as executable examples in the task notes**

The fetch handler must behave like this:

```js
if (event.request.method !== "GET") return;

const url = new URL(event.request.url);

if (url.origin !== self.location.origin) return;
if (url.pathname.startsWith("/api")) return;
```

This task does not add a new automated test file because the repository currently has no SW harness; verification is by syntax check and behavior review.

- [ ] **Step 2: Run a syntax check baseline**

Run: `node --check sw.js`

Expected: either no output (valid syntax) or a syntax failure that must be eliminated after edits.

- [ ] **Step 3: Write minimal implementation in `sw.js`**

Update the file to this structure:

```js
const CACHE_NAME = "neoviet360-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./styles/globals.css",
  "./styles/theme.css",
  "./styles/components.css",
  "./config.js",
  "./utils/state.js",
  "./utils/router.js",
  "./public/logo.svg",
  "./public/favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.startsWith("/api")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
```

- [ ] **Step 4: Run syntax check to verify it passes**

Run: `node --check sw.js`

Expected: no output, exit code `0`

- [ ] **Step 5: Commit**

```bash
git add sw.js
git commit -m "fix: bypass api requests in service worker"
```

### Task 3: Normalize frontend API base URL resolution

**Files:**
- Modify: `utils/api-adapter.js`
- Read for context only: `config.js`

**Interfaces:**
- Consumes:
  - `window.ENV?.API_URL`
  - `window.CONFIG?.API_BASE`
- Produces:
  - `resolveApiBase()` helper
  - normalized `API_BASE` string without trailing slash
  - unchanged public adapter methods such as `request(method, endpoint, data)`

- [ ] **Step 1: Define the failing cases to guard against**

The resolver must support these exact examples:

```js
resolveApiBase({ ENV: { API_URL: "https://api.example.com/" }, CONFIG: { API_BASE: "http://localhost:3001" } })
// => "https://api.example.com"

resolveApiBase({ ENV: {}, CONFIG: { API_BASE: "http://localhost:3001/" } })
// => "http://localhost:3001"

resolveApiBase({})
// => "https://neoviet360-backend.vercel.app"
```

- [ ] **Step 2: Run a syntax baseline before editing**

Run: `node --check utils/api-adapter.js`

Expected: no output, exit code `0`

- [ ] **Step 3: Write minimal implementation in `utils/api-adapter.js`**

Replace the top-level API base constant with a resolver helper:

```js
function normalizeApiBase(url) {
  return String(url || "").replace(/\/+$/, "");
}

function resolveApiBase(runtimeWindow = typeof window !== "undefined" ? window : undefined) {
  const envApiBase = runtimeWindow?.ENV?.API_URL;
  if (envApiBase) {
    return normalizeApiBase(envApiBase);
  }

  const configApiBase = runtimeWindow?.CONFIG?.API_BASE;
  if (configApiBase) {
    return normalizeApiBase(configApiBase);
  }

  return "https://neoviet360-backend.vercel.app";
}

const API_BASE = resolveApiBase();
```

Keep request construction unchanged except that it now uses the normalized `API_BASE`:

```js
const url = `${API_BASE}${endpoint}`;
```

At the bottom, extend the CommonJS export so local verification can inspect the resolver without breaking browser behavior:

```js
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    api,
    APIAdapter,
    resolveApiBase,
    normalizeApiBase,
  };
}
```

- [ ] **Step 4: Run syntax check to verify it passes**

Run: `node --check utils/api-adapter.js`

Expected: no output, exit code `0`

- [ ] **Step 5: Commit**

```bash
git add utils/api-adapter.js config.js
git commit -m "fix: normalize frontend api base resolution"
```

### Task 4: Verify integrated behavior and document redeploy caveats

**Files:**
- Modify: `tests/cors-origin.test.js` only if needed for compatibility with final backend behavior
- Read for context only: `docs/superpowers/specs/2026-06-23-neoviet360-cors-sw-apiurl-design.md`

**Interfaces:**
- Consumes:
  - backend app from `neoviet360-backend/src/app.js`
  - service worker in `sw.js`
  - resolver exports from `utils/api-adapter.js`
- Produces:
  - verified local checks
  - deployment notes describing what still requires redeploy/hard refresh

- [ ] **Step 1: Verify backend CORS test**

Run: `node tests/cors-origin.test.js`

Expected:

```txt
OPTIONS /api/auth/login status 204
access-control-allow-origin http://127.0.0.1:5500
```

Exit code: `0`

- [ ] **Step 2: Verify backend syntax**

Run: `node --check neoviet360-backend/src/app.js`

Expected: no output, exit code `0`

- [ ] **Step 3: Verify service worker and adapter syntax**

Run: `node --check sw.js && node --check utils/api-adapter.js`

Expected: no output, exit code `0`

- [ ] **Step 4: Verify API base resolver behavior directly**

Run:

```bash
node -e "const { resolveApiBase } = require('./utils/api-adapter.js'); console.log(resolveApiBase({ ENV: { API_URL: 'https://api.example.com/' }, CONFIG: { API_BASE: 'http://localhost:3001/' } })); console.log(resolveApiBase({ CONFIG: { API_BASE: 'http://localhost:3001/' } })); console.log(resolveApiBase({}));"
```

Expected output:

```txt
https://api.example.com
http://localhost:3001
https://neoviet360-backend.vercel.app
```

- [ ] **Step 5: Commit**

```bash
git add neoviet360-backend/src/app.js sw.js utils/api-adapter.js tests/cors-origin.test.js docs/superpowers/specs/2026-06-23-neoviet360-cors-sw-apiurl-design.md docs/superpowers/plans/2026-06-23-neoviet360-cors-sw-apiurl-fix.md
git commit -m "chore: verify cors service worker and api url fixes"
```

## Self-Review

### 1. Spec coverage

- Backend local allowlist + env support: covered in Task 1
- Unified preflight handling: covered in Task 1
- Service worker same-origin static-only caching: covered in Task 2
- Skip API and cross-origin requests: covered in Task 2
- API URL precedence `window.ENV` → `window.CONFIG` → fallback: covered in Task 3
- Normalize trailing slash: covered in Task 3
- Local verification + redeploy caveat awareness: covered in Task 4

No spec gaps found.

### 2. Placeholder scan

The plan contains:
- exact file paths
- exact commands
- exact code snippets for each code-changing step
- no `TODO`, `TBD`, or "implement later" placeholders

### 3. Type consistency

- `resolveApiBase(runtimeWindow)` and `normalizeApiBase(url)` are defined in Task 3 and reused consistently in Task 4
- `API_BASE` remains a string used by `request(method, endpoint, data)`
- `app` remains the exported Express application used by `tests/cors-origin.test.js`

Plan is internally consistent.