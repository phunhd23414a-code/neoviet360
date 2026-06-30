const fs = require('fs');
const path = require('path');
const assert = require('assert');

const projectRoot = path.resolve(__dirname, '..');
const legacyApiPath = path.join(projectRoot, 'utils', 'api.js');
const backendAdapterPath = path.join(projectRoot, 'utils', 'api-adapter.js');

const legacyApiSource = fs.readFileSync(legacyApiPath, 'utf8');
const backendAdapterSource = fs.readFileSync(backendAdapterPath, 'utf8');

assert(
  !/window\.api\s*=\s*api\s*;/.test(legacyApiSource),
  'utils/api.js must not overwrite window.api because auth.login lives on utils/api-adapter.js'
);

assert(
  /window\.mockApi\s*=/.test(legacyApiSource) || /window\.legacyApi\s*=/.test(legacyApiSource),
  'utils/api.js should expose mock/local JSON helpers on a separate browser namespace'
);

assert(
  /window\.api\s*=\s*api\s*;/.test(backendAdapterSource),
  'utils/api-adapter.js should remain the single owner of window.api'
);

assert(
  /auth\s*=/.test(backendAdapterSource) && /login:\s*\(email,\s*password\)/.test(backendAdapterSource),
  'utils/api-adapter.js must expose window.api.auth.login(email, password)'
);

console.log('api namespace contract passed');