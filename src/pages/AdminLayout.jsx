import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const navItems = [
    { to: '/admin', label: 'Painel', end: true },
    { to: '/admin/artigos', label: 'Artigos' },
    { to: '/admin/recomendacoes', label: 'Recomendações' },
    { to: '/admin/downloads', label: 'Downloads' },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-logo-cross" aria-hidden="true">✝</span>
          <span className="admin-logo-text">Editor</span>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <p className="admin-user-name">{user?.name || 'Editor'}</p>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Sair
          </button>
          <a href="/" className="admin-back-link" target="_blank" rel="noopener noreferrer">
            Ver blog →
          </a>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
