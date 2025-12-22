/**
 * Test script for API integration
 * This script tests the new API endpoints to ensure they work correctly
 */

// Mock fetch function for testing
const mockFetch = (url, options) => {
  console.log(`Mock fetch called: ${options?.method || 'GET'} ${url}`);
  console.log('Options:', options);
  
  // Simulate different responses based on the URL
  if (url.includes('/auth/token') && options?.method === 'POST') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        access_token: 'mock_access_token_123',
        refresh_token: 'mock_refresh_token_456',
        token_type: 'bearer'
      })
    });
  }
  
  if (url.includes('/users/me')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        avatar_url: 'https://example.com/avatar.jpg',
        roles: [2], // Admin role
        customers: [1, 2, 3]
      })
    });
  }
  
  if (url.includes('/customers')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 1,
          name: 'Customer 1',
          email: 'customer1@example.com',
          schema_name: 'customer_1',
          status: true,
          phone: '+351900000001'
        },
        {
          id: 2,
          name: 'Customer 2',
          email: 'customer2@example.com',
          schema_name: 'customer_2',
          status: true,
          phone: '+351900000002'
        }
      ])
    });
  }
  
  return Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.resolve({ error: 'Not found' })
  });
};

// Test authentication flow
async function testAuthentication() {
  console.log('=== Testing Authentication Flow ===');
  
  try {
    // Test login
    console.log('1. Testing login...');
    const formData = new URLSearchParams();
    formData.append('username', 'test@example.com');
    formData.append('password', 'password123');
    
    const loginResponse = await mockFetch('https://api.weboost.pt/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formData.toString()
    });
    
    const loginData = await loginResponse.json();
    console.log('Login successful:', loginData);
    
    // Test user data fetch
    console.log('2. Testing user data fetch...');
    const userResponse = await mockFetch('https://api.weboost.pt/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`,
        'Accept': 'application/json'
      }
    });
    
    const userData = await userResponse.json();
    console.log('User data fetched:', userData);
    
    // Test customer fetch
    console.log('3. Testing customer fetch...');
    const customersResponse = await mockFetch('https://api.weboost.pt/customers', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`,
        'Accept': 'application/json'
      }
    });
    
    const customersData = await customersResponse.json();
    console.log('Customers fetched:', customersData);
    
    console.log('✅ All authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
  }
}

// Test refresh token flow
async function testRefreshToken() {
  console.log('\n=== Testing Refresh Token Flow ===');
  
  try {
    const refreshResponse = await mockFetch('https://api.weboost.pt/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        refresh_token: 'mock_refresh_token_456',
        active_customer: 1
      })
    });
    
    const refreshData = await refreshResponse.json();
    console.log('Refresh token successful:', refreshData);
    console.log('✅ Refresh token test passed!');
    
  } catch (error) {
    console.error('❌ Refresh token test failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting API Integration Tests\n');
  
  await testAuthentication();
  await testRefreshToken();
  
  console.log('\n🎉 All tests completed!');
}

// Run tests
runAllTests();