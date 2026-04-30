import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/authContextValue'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    navigate('/admin', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos.')
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-box fade-in-up">
        <div className="login-header">
          <span className="login-cross" aria-hidden="true">✝</span>
          <h1>Editor</h1>
          <p>Acesso restrito à área editorial</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">E-mail</label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Senha</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="form-error" style={{ marginBottom: '1rem' }}>{error}</p>}

          <button
            type="submit"
            className="btn-classic-filled"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
