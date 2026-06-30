const http = require('http');

// Test the /health endpoint
function testHealth() {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('Health endpoint status:', res.statusCode);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Health response:', data);
      testAuthLogin();
    });
  });

  req.on('error', (e) => {
    console.error('Health test error:', e);
  });

  req.end();
}

// Test the /api/auth/login endpoint
function testAuthLogin() {
  const postData = JSON.stringify({
    email: 'test@test.com',
    password: 'password'
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log('\nAuth login endpoint status:', res.statusCode);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Auth login response:', data);
      testAccountsGet();
    });
  });

  req.on('error', (e) => {
    console.error('Auth login test error:', e);
  });

  req.write(postData);
  req.end();
}

// Test the /api/accounts endpoint
function testAccountsGet() {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/accounts',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer fake-token'
    }
  };

  const req = http.request(options, (res) => {
    console.log('\nAccounts endpoint status:', res.statusCode);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Accounts response:', data);
    });
  });

  req.on('error', (e) => {
    console.error('Accounts test error:', e);
  });

  req.end();
}

console.log('Starting API tests...\n');
testHealth();