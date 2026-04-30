import Link from 'next/link'
import { requireEditor } from '../../lib/auth'
import { logoutAction } from '../actions'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }) {
  const user = await requireEditor()

  const navItems = [
    { to: '/admin', label: 'Painel' },
    { to: '/admin/artigos', label: 'Artigos' },
    { to: '/admin/recomendacoes', label: 'Recomendacoes' },
    { to: '/admin/downloads', label: 'Downloads' },
    { to: '/admin/mensagens', label: 'Mensagens' },
    { to: '/admin/usuarios', label: 'Usuarios' },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-logo-cross" aria-hidden="true">+</span>
          <span className="admin-logo-text">Editor</span>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link key={item.to} href={item.to} className="admin-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <p className="admin-user-name">{user.name || user.email}</p>
          <form action={logoutAction}>
            <button className="admin-logout-btn">Sair</button>
          </form>
          <Link href="/" className="admin-back-link">Ver blog</Link>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  )
}
