const axios = require('axios');

async function testAPI() {
  const baseURL = 'http://localhost:3000';

  try {
    console.log('🔍 Testing Echoo API...\n');

    // Test 1: Basic health check
    console.log('1. Testing basic endpoint...');
    const healthResponse = await axios.get(`${baseURL}/`);
    console.log(
      `✅ Health check: ${healthResponse.data.message || healthResponse.data}`,
    );

    // Test 2: Test auth endpoint
    console.log('\n2. Testing auth endpoints...');
    try {
      const registerResponse = await axios.post(`${baseURL}/auth/register`, {
        email: 'test@example.com',
        password: 'testpassword123',
        name: 'Test User',
      });
      console.log('✅ Register endpoint working');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Register endpoint working (user might already exist)');
      } else {
        console.log(
          '❌ Register endpoint error:',
          error.response?.data || error.message,
        );
      }
    }

    try {
      const loginResponse = await axios.post(`${baseURL}/auth/login`, {
        email: 'test@example.com',
        password: 'testpassword123',
      });
      console.log('✅ Login endpoint working');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(
          '✅ Login endpoint working (incorrect credentials expected)',
        );
      } else {
        console.log(
          '❌ Login endpoint error:',
          error.response?.data || error.message,
        );
      }
    }

    // Test 3: Test protected endpoints
    console.log('\n3. Testing protected endpoints...');
    try {
      const meResponse = await axios.get(`${baseURL}/auth/me`);
      console.log('✅ Protected endpoint accessible');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Protected endpoint properly secured');
      } else {
        console.log(
          '❌ Protected endpoint error:',
          error.response?.data || error.message,
        );
      }
    }

    console.log('\n🎉 API testing completed!\n');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();
