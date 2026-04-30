import { createUser } from '../../actions'
import { prisma } from '../../../lib/db'

export default async function UsersAdmin() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, name: true, role: true, active: true },
  })

  return (
    <div className="fade-in-up">
      <div className="admin-page-header">
        <h1>Usuarios</h1>
        <p>Crie editores sem depender do Supabase Auth.</p>
      </div>

      <form action={createUser} style={{ maxWidth: 680, marginBottom: '2rem' }}>
        <div className="admin-field">
          <label htmlFor="user-name">Nome</label>
          <input id="user-name" name="name" />
        </div>
        <div className="admin-field">
          <label htmlFor="user-email">E-mail</label>
          <input id="user-email" name="email" type="email" required />
        </div>
        <div className="admin-field">
          <label htmlFor="user-password">Senha inicial</label>
          <input id="user-password" name="password" type="password" required />
        </div>
        <button className="btn-classic-filled">Criar Editor</button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Status</th></tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><strong>{user.name || 'Editor'}</strong></td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td><span className={`admin-badge ${user.active ? 'published' : 'draft'}`}>{user.active ? 'Ativo' : 'Inativo'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
