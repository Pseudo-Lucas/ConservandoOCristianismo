import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/authContextValue'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontFamily: 'var(--font-serif)',
        color: 'var(--color-text-muted)',
        fontSize: '0.95rem',
        letterSpacing: '0.1em',
      }}>
        Carregando...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
