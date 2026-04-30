import Link from 'next/link'
import { deleteDownload } from '../../actions'
import { prisma } from '../../../lib/db'

export default async function DownloadsAdmin() {
  const items = await prisma.download.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="fade-in-up">
      <div className="admin-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1>Downloads</h1>
            <p>Gerencie os materiais disponiveis.</p>
          </div>
          <Link href="/admin/downloads/novo" className="btn-classic-filled">Novo Download</Link>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Nome</th><th>Categoria</th><th>Status</th><th>Acoes</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.name}</strong></td>
                <td>{item.category}</td>
                <td><span className={`admin-badge ${item.published ? 'published' : 'draft'}`}>{item.published ? 'Publicado' : 'Oculto'}</span></td>
                <td>
                  <div className="admin-actions">
                    <Link href={`/admin/downloads/${item.id}`} className="admin-action-btn">Editar</Link>
                    <form action={deleteDownload}>
                      <input type="hidden" name="id" value={item.id} />
                      <button className="admin-action-btn danger">Excluir</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
