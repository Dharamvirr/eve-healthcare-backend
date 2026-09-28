const http = require('http');

async function runTest() {
  console.log('--- Starting API Integration Test ---');
  
  const baseUrl = 'http://localhost:5000/api';

  try {
    // 1. Signup
    console.log('1. Signing up...');
    let res = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: `test${Date.now()}@example.com`, password: 'password123' })
    });
    let data = await res.json();
    if (!res.ok) {
        console.error('Signup failed:', data);
    }
    const token = data.token;
    console.log('   Token received!');

    // 2. Create Centre
    console.log('2. Creating diagnostic centre...');
    res = await fetch(`${baseUrl}/centres`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'EVE Central Lab',
        location: 'Mumbai',
        tests: [{ name: 'MRI', price: 5000 }, { name: 'Blood Test', price: 500 }]
      })
    });
    data = await res.json();
    const centreId = data._id;
    console.log(`   Centre Created: ${centreId}`);

    // 3. Create Booking
    console.log('3. Creating booking...');
    res = await fetch(`${baseUrl}/bookings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        centreId: centreId,
        testName: 'MRI',
        appointmentDate: '2026-10-15T10:00:00.000Z'
      })
    });
    data = await res.json();
    if (!res.ok) {
        console.error('Booking failed:', data);
    }
    const bookingId = data._id;
    console.log(`   Booking Created: ${bookingId}, Status: ${data.status}`);

    // 4. Simulate Payment
    console.log('4. Simulating payment...');
    res = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bookingId })
    });
    data = await res.json();
    console.log(`   Payment Status: ${data.paymentStatus}`);
    
    // 5. Fire Webhook
    console.log('5. Firing Webhook with payload...');
    res = await fetch(`${baseUrl}/payments/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.webhookPayload)
    });
    let webhookRes = await res.json();
    console.log(`   Webhook Response: ${webhookRes.message}`);

    // 6. Check final booking status
    console.log('6. Checking final booking status...');
    res = await fetch(`${baseUrl}/bookings/${bookingId}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    data = await res.json();
    console.log(`   Final Booking Status: ${data.status} (Amount: ${data.amount})`);
    
    console.log('--- Test Completed Successfully ---');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

runTest();
