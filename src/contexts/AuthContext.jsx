import { useEffect, useState } from 'react'
import { requireSupabase, supabase } from '../lib/supabaseClient'
import { AuthContext } from './authContextValue'

function userFromSession(session) {
  if (!session?.user) return null

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.user_metadata?.name || session.user.email,
    role: 'editor',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) {
      return undefined
    }

    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUser(userFromSession(data.session))
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(userFromSession(session))
      setLoading(false)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    const { data, error } = await requireSupabase().auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error('Credenciais invalidas.')
    }

    const sessionUser = userFromSession(data.session)
    setUser(sessionUser)
    return sessionUser
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
