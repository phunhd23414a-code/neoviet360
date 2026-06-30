const fs = require("fs");
const path = require("path");

const loginPagePath = path.join(__dirname, "..", "pages", "LoginPage.js");
const seedPath = path.join(__dirname, "..", "neoviet360-backend", "prisma", "seed.js");

const loginPageContent = fs.readFileSync(loginPagePath, "utf8");
const seedContent = fs.readFileSync(seedPath, "utf8");

const loginEmailMatch = loginPageContent.match(/id="login-username"\s+value="([^"]+)"/);
const loginPasswordMatch = loginPageContent.match(/id="login-password"\s+value="([^"]+)"/);

const seedEmailMatch = seedContent.match(/email:\s*"([^"]+)"/);
const seedPasswordMatch = seedContent.match(/bcrypt\.hash\("([^"]+)"/);

if (!loginEmailMatch || !loginPasswordMatch) {
  console.error("Could not find default login credentials in pages/LoginPage.js");
  process.exit(1);
}

if (!seedEmailMatch || !seedPasswordMatch) {
  console.error("Could not find seeded demo credentials in neoviet360-backend/prisma/seed.js");
  process.exit(1);
}

const loginEmail = loginEmailMatch[1];
const loginPassword = loginPasswordMatch[1];
const seedEmail = seedEmailMatch[1];
const seedPassword = seedPasswordMatch[1];

console.log("Login page defaults:", { email: loginEmail, password: loginPassword });
console.log("Seed credentials:", { email: seedEmail, password: seedPassword });

const isValid = loginEmail === seedEmail && loginPassword === seedPassword;

if (!isValid) {
  console.error("Default login credentials do not match seeded backend credentials.");
  process.exit(1);
}

console.log("Default login credentials match seeded backend credentials.");
process.exit(0);