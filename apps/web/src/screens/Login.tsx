import { useState, type FormEvent } from 'react'
import { useAuth } from '../auth/useAuth'

function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error: signInError } = await signIn(email, password)
    if (signInError) setError(signInError)
    setSubmitting(false)
  }

  return (
    <main className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>HR Portal</h1>
        <p>Sign in to continue</p>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error && <p className="login-error">{error}</p>}
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}

export default Login
