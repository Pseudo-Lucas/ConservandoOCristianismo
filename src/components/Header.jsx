'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/artigos', label: 'Artigos' },
    { to: '/recomendacoes', label: 'Recomendacoes' },
    { to: '/downloads', label: 'Downloads' },
    { to: '/contato', label: 'Contato' },
  ]

  return (
    <header className="site-header">
      <div className="container">
        <div className="logo-container">
          <span className="logo-cross" aria-hidden="true">✝</span>
          <Link href="/" className="logo-text" style={{ textDecoration: 'none', color: 'inherit' }}>
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
            {navLinks.map((link) => {
              const active = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to)
              return (
                <li key={link.to}>
                  <Link
                    href={link.to}
                    className={active ? 'active' : ''}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <Link href="/login" className="header-login-link" title="Area do editor">
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  )
}
