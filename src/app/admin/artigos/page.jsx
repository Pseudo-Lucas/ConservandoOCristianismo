import Link from 'next/link'
import { deleteArticle } from '../../actions'
import { prisma } from '../../../lib/db'

export default async function ArticleListAdmin() {
  const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="fade-in-up">
      <div className="admin-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Artigos</h1>
            <p>Gerencie todos os artigos do blog.</p>
          </div>
          <Link href="/admin/artigos/novo" className="btn-classic-filled">Novo Artigo</Link>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td><strong>{article.title}</strong></td>
                <td>{article.category}</td>
                <td><span className={`admin-badge ${article.status}`}>{article.status === 'published' ? 'Publicado' : 'Rascunho'}</span></td>
                <td>
                  <div className="admin-actions">
                    <Link className="admin-action-btn" href={`/admin/artigos/${article.id}`}>Editar</Link>
                    <form action={deleteArticle}>
                      <input type="hidden" name="id" value={article.id} />
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
