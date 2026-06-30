/**
 * NeoViet 360 - API Adapter
 * Kết nối UI hiện tại với backend API
 * Chỉ cần thay đổi API_BASE trong config.js
 */

const API_BASE = "http://localhost:3001"; // Đổi thành domain thật khi deploy

// Lấy token từ localStorage
function getToken() {
  return localStorage.getItem("neoviet_token");
}

// Headers mặc định cho authenticated requests
function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

// Wrapper cho fetch API
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: { ...authHeaders(), ...options.headers }
  };
  const res = await fetch(url, config);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ============ AUTH ============
export const auth = {
  login: (email, password) => apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (data) => apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  google: () => window.location.href = `${API_BASE}/api/auth/google`,
  zalo: () => window.location.href = `${API_BASE}/api/auth/zalo`,
  logout: () => { localStorage.removeItem("neoviet_token"); localStorage.removeItem("neoviet_user"); },
  me: () => apiFetch("/api/auth/me")
};

// ============ ACCOUNTS ============
export const accounts = {
  list: () => apiFetch("/api/accounts"),
  get: (id) => apiFetch(`/api/accounts/${id}`),
  create: (data) => apiFetch("/api/accounts", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/accounts/${id}`, { method: "PUT", body: JSON.stringify(data) })
};

// ============ TRANSACTIONS ============
export const transactions = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/transactions${query ? `?${query}` : ""}`);
  },
  get: (id) => apiFetch(`/api/transactions/${id}`),
  create: (data) => apiFetch("/api/transactions", { method: "POST", body: JSON.stringify(data) })
};

// ============ TRANSFER ============
export const transfer = {
  execute: (data) => apiFetch("/api/transfer", { method: "POST", body: JSON.stringify(data) })
};

// ============ BUDGETS ============
export const budgets = {
  list: () => apiFetch("/api/budgets"),
  create: (data) => apiFetch("/api/budgets", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/budgets/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/api/budgets/${id}`, { method: "DELETE" })
};

// ============ SAVINGS ============
export const savings = {
  list: () => apiFetch("/api/savings"),
  create: (data) => apiFetch("/api/savings", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/savings/${id}`, { method: "PUT", body: JSON.stringify(data) })
};

// ============ LOANS ============
export const loans = {
  list: () => apiFetch("/api/loans"),
  create: (data) => apiFetch("/api/loans", { method: "POST", body: JSON.stringify(data) })
};

// ============ CARDS ============
export const cards = {
  list: () => apiFetch("/api/cards"),
  create: (data) => apiFetch("/api/cards", { method: "POST", body: JSON.stringify(data) }),
  freeze: (id) => apiFetch(`/api/cards/${id}/freeze`, { method: "PUT" })
};

// ============ BILLS ============
export const bills = {
  list: () => apiFetch("/api/bills"),
  create: (data) => apiFetch("/api/bills", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/bills/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/api/bills/${id}`, { method: "DELETE" })
};

// ============ SPLIT BILLS ============
export const splitBills = {
  list: () => apiFetch("/api/split-bills"),
  create: (data) => apiFetch("/api/split-bills", { method: "POST", body: JSON.stringify(data) })
};

// ============ REWARDS ============
export const rewards = {
  list: () => apiFetch("/api/rewards")
};

// ============ NOTIFICATIONS ============
export const notifications = {
  list: () => apiFetch("/api/notifications"),
  markRead: (id) => apiFetch(`/api/notifications/${id}/read`, { method: "PUT" })
};

// ============ EXTERNAL APIs ============
export const external = {
  fxRates: () => apiFetch("/api/fx-rates"),
  crypto: () => apiFetch("/api/crypto"),
  chat: (message) => apiFetch("/api/chat", { method: "POST", body: JSON.stringify({ message }) }),
  carbon: () => apiFetch("/api/carbon"),
  addCarbon: (data) => apiFetch("/api/carbon", { method: "POST", body: JSON.stringify(data) })
};

// ============ CHAT HISTORY ============
export const chatHistory = {
  list: () => apiFetch("/api/chat-history"),
  add: (role, content) => apiFetch("/api/chat-history", { method: "POST", body: JSON.stringify({ role, content }) })
};

// Kiểm tra đã login chưa
export function isAuthenticated() {
  return !!getToken();
}

// Lưu token sau khi login thành công
export function setAuth(token, user) {
  localStorage.setItem("neoviet_token", token);
  localStorage.setItem("neoviet_user", JSON.stringify(user));
}

// Lấy user info
export function getUser() {
  const u = localStorage.getItem("neoviet_user");
  return u ? JSON.parse(u) : null;
}

export default {
  auth, accounts, transactions, transfer,
  budgets, savings, loans, cards, bills, splitBills,
  rewards, notifications, external, chatHistory,
  isAuthenticated, setAuth, getUser, API_BASE
};