import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const mockUsers = [
  { id: 'u-1', name: '관리자', email: 'admin@example.com' },
  { id: 'u-2', name: '홍길동', email: 'hong@example.com' },
];

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력하세요.' });
  }

  const user = mockUsers.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user || password !== 'password') {
    return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  }

  // return mock token + user
  // token expires in 60 seconds for demo
  return res.json({ token: 'mock-token-123', user, expiresIn: 60 });
});

app.post('/api/refresh', (req, res) => {
  const { token } = req.body || {};
  // In real life you would validate the token.
  if (!token) {
    return res.status(400).json({ message: 'token required' });
  }

  // For demo, accept the mock token and return a new token
  if (token === 'mock-token-123' || token === 'mock-token-456') {
    return res.json({ token: 'mock-token-456', expiresIn: 60 });
  }

  return res.status(401).json({ message: 'invalid token' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Mock auth server listening on http://localhost:${port}`);
});
