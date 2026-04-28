import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/artigos', label: 'Artigos' },
    { to: '/recomendacoes', label: 'Recomendações' },
    { to: '/downloads', label: 'Downloads' },
    { to: '/contato', label: 'Contato' },
  ]

  return (
    <header className="site-header">
      <div className="container">
        <div className="logo-container">
          <span className="logo-cross" aria-hidden="true">✝</span>
          <Link to="/" className="logo-text" style={{ textDecoration: 'none', color: 'inherit' }}>
            c o n s e r v a n d o &nbsp; o &nbsp; c r i s t i a n i s m o
          </Link>
          <button
            className="nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <nav className="site-nav">
          <ul className={`nav-list${menuOpen ? ' open' : ''}`}>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link to="/login" className="header-login-link" title="Área do editor">
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  )
}
