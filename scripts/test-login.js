import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'password' }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Login failed:', data);
      process.exit(2);
    }

    console.log('Login response:', data);

    const refresh = await fetch('http://localhost:4000/api/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: data.token }),
    });

    const refreshData = await refresh.json();
    if (!refresh.ok) {
      console.error('Refresh failed:', refreshData);
      process.exit(3);
    }

    console.log('Refresh response:', refreshData);
    process.exit(0);
  } catch (err) {
    console.error('Test error', err);
    process.exit(1);
  }
}

test();
