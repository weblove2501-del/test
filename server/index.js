import express from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())

const mockUsers = [
  { id: 'u-1', name: '관리자', email: 'admin@example.com' },
  { id: 'u-2', name: '홍길동', email: 'hong@example.com' },
]

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력하세요.' })
  }

  const user = mockUsers.find((u) => u.email.toLowerCase() === String(email).toLowerCase())
  if (!user || password !== 'password') {
    return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
  }

  // return mock token + user
  return res.json({ token: 'mock-token-123', user })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock auth server listening on http://localhost:${port}`)
})
