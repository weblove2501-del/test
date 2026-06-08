import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAppContext } from '../context/AppContext'
import styles from './LoginForm.module.css'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAppContext()

  const validateEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setEmailError(null)
    setPasswordError(null)
    setSubmitError(null)

    const trimmedEmail = email.trim()
    let hasError = false

    if (!trimmedEmail) {
      setEmailError('이메일을 입력하세요.')
      hasError = true
    } else if (!validateEmail(trimmedEmail)) {
      setEmailError('유효한 이메일을 입력하세요.')
      hasError = true
    }

    if (!password) {
      setPasswordError('비밀번호를 입력하세요.')
      hasError = true
    }

    if (hasError) {
      return
    }

    setIsSubmitting(true)
    try {
      const result = await login(trimmedEmail, password)

      if (typeof result === 'string') {
        setSubmitError(result)
      } else {
        setSubmitError(null)
      }
    } catch {
      setSubmitError('로그인 처리 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <h1>업무 시스템 로그인</h1>
        <p className={styles.subtitle}>관리자 또는 사용자의 계정으로 로그인하세요.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.field}>
            <span className={styles.label}>이메일</span>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setEmailError(null)
                setSubmitError(null)
              }}
              placeholder="example@example.com"
              className={styles.input}
            />
            {emailError && <div className={styles.error}>{emailError}</div>}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setPasswordError(null)
                setSubmitError(null)
              }}
              placeholder="password"
              className={styles.input}
            />
            {passwordError && <div className={styles.error}>{passwordError}</div>}
          </label>

          {submitError && <div className={styles.error}>{submitError}</div>}

          <button type="submit" className={styles.loginButton} disabled={isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>

          <div className={styles.hint}>
            테스트 계정: admin@example.com, user@example.com / 비밀번호: password
          </div>
        </form>
      </div>
    </div>
  )
}
