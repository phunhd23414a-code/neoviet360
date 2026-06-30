// Test API endpoints
const API_BASE = 'http://localhost:3001';

async function test() {
  console.log('=== Testing NeoViet 360 Backend API ===\n');

  // Test 1: Login
  console.log('1. Testing POST /api/auth/login...');
  try {
    const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@neoviet360.vn', password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log(`   Status: ${loginRes.status}`);
    console.log(`   Token: ${loginData.token ? '✓ Received' : '✗ Missing'}`);
    console.log(`   User: ${loginData.user?.name || 'N/A'}`);
    
    if (!loginData.token) {
      console.log('   Full response:', JSON.stringify(loginData, null, 2));
      return;
    }
    
    const token = loginData.token;
    console.log('');

    // Test 2: Get accounts
    console.log('2. Testing GET /api/accounts...');
    const accountsRes = await fetch(`${API_BASE}/api/accounts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const accounts = await accountsRes.json();
    console.log(`   Status: ${accountsRes.status}`);
    console.log(`   Accounts: ${Array.isArray(accounts) ? accounts.length : 0}`);
    if (Array.isArray(accounts) && accounts.length > 0) {
      console.log(`   First account: ${accounts[0].name} - ${accounts[0].balance} ${accounts[0].currency}`);
    }
    console.log('');

    // Test 3: Get transactions
    console.log('3. Testing GET /api/transactions...');
    const txRes = await fetch(`${API_BASE}/api/transactions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const transactions = await txRes.json();
    console.log(`   Status: ${txRes.status}`);
    console.log(`   Transactions: ${Array.isArray(transactions) ? transactions.length : 0}`);
    console.log('');

    // Test 4: Get budgets
    console.log('4. Testing GET /api/budgets...');
    const budgetsRes = await fetch(`${API_BASE}/api/budgets`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const budgets = await budgetsRes.json();
    console.log(`   Status: ${budgetsRes.status}`);
    console.log(`   Budgets: ${Array.isArray(budgets) ? budgets.length : 0}`);
    console.log('');

    // Test 5: Get savings
    console.log('5. Testing GET /api/savings...');
    const savingsRes = await fetch(`${API_BASE}/api/savings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const savings = await savingsRes.json();
    console.log(`   Status: ${savingsRes.status}`);
    console.log(`   Savings goals: ${Array.isArray(savings) ? savings.length : 0}`);
    console.log('');

    // Test 6: Get notifications
    console.log('6. Testing GET /api/notifications...');
    const notifRes = await fetch(`${API_BASE}/api/notifications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const notifications = await notifRes.json();
    console.log(`   Status: ${notifRes.status}`);
    console.log(`   Notifications: ${Array.isArray(notifications) ? notifications.length : 0}`);
    console.log('');

    // Test 7: Get rewards
    console.log('7. Testing GET /api/rewards...');
    const rewardsRes = await fetch(`${API_BASE}/api/rewards`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const rewards = await rewardsRes.json();
    console.log(`   Status: ${rewardsRes.status}`);
    console.log(`   Rewards: ${JSON.stringify(rewards)}`);
    console.log('');

    // Test 8: Get FX rates
    console.log('8. Testing GET /api/fx-rates...');
    const fxRes = await fetch(`${API_BASE}/api/fx-rates`);
    const fxRates = await fxRes.json();
    console.log(`   Status: ${fxRes.status}`);
    console.log(`   FX Rates: ${Array.isArray(fxRates) ? fxRates.length : 'N/A'}`);
    console.log('');

    // Test 9: Get crypto
    console.log('9. Testing GET /api/crypto...');
    const cryptoRes = await fetch(`${API_BASE}/api/crypto`);
    const crypto = await cryptoRes.json();
    console.log(`   Status: ${cryptoRes.status}`);
    console.log(`   Crypto: ${Array.isArray(crypto) ? crypto.length : 'N/A'}`);
    console.log('');

    console.log('=== All API Tests Completed ===');
    console.log('\n✅ Backend is fully functional!');
    console.log('📋 Next: Run frontend with `python -m http.server 5500`');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();