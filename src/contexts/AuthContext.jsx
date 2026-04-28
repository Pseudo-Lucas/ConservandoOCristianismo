import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Mock credentials — replace with real auth service in production
const MOCK_USERS = [
  { email: 'admin@conservando.com', password: 'admin123', name: 'Lucas Gomes', role: 'editor' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored session
    const stored = localStorage.getItem('cc_auth')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('cc_auth')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 400))

    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    )

    if (!found) {
      throw new Error('Credenciais inválidas.')
    }

    const session = { email: found.email, name: found.name, role: found.role }
    setUser(session)
    localStorage.setItem('cc_auth', JSON.stringify(session))
    return session
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cc_auth')
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
