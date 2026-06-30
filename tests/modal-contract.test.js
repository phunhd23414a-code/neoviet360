const fs = require('fs');
const path = require('path');
const assert = require('assert');

const projectRoot = path.resolve(__dirname, '..');
const modalPath = path.join(projectRoot, 'components', 'Modal.js');
const aiCoachModalPath = path.join(projectRoot, 'components', 'AICoachModal.js');
const logoutModalPath = path.join(projectRoot, 'components', 'LogoutModal.js');

const modalSource = fs.readFileSync(modalPath, 'utf8');
const aiCoachModalSource = fs.readFileSync(aiCoachModalPath, 'utf8');
const logoutModalSource = fs.readFileSync(logoutModalPath, 'utf8');

const aiCoachUsesShowSuccess = /Modal\.showSuccess\s*\(/.test(aiCoachModalSource);
const modalDefinesShowSuccess =
  /showSuccess\s*:\s*\(/.test(modalSource) ||
  /showSuccess\s*=\s*\(/.test(modalSource) ||
  /Modal\.showSuccess\s*=/.test(modalSource);

assert(
  !aiCoachUsesShowSuccess || modalDefinesShowSuccess,
  'components/Modal.js must define showSuccess when components/AICoachModal.js calls Modal.showSuccess(...)'
);

assert(
  /neo-modal-container/.test(modalSource),
  'components/Modal.js should keep the shared neo-modal-container contract'
);

assert(
  /logout-modal/.test(logoutModalSource),
  'components/LogoutModal.js contract changed unexpectedly during modal refactor'
);

console.log('modal contract passed');