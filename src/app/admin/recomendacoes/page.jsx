import Link from 'next/link'
import { deleteRecommendation } from '../../actions'
import { prisma } from '../../../lib/db'

export default async function RecommendationsAdmin() {
  const books = await prisma.recommendation.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="fade-in-up">
      <div className="admin-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1>Recomendacoes</h1>
            <p>Gerencie as recomendacoes de leitura.</p>
          </div>
          <Link href="/admin/recomendacoes/novo" className="btn-classic-filled">Nova Recomendacao</Link>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Titulo</th><th>Autor</th><th>Acoes</th></tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td><strong>{book.title}</strong></td>
                <td>{book.author}</td>
                <td>
                  <div className="admin-actions">
                    <Link href={`/admin/recomendacoes/${book.id}`} className="admin-action-btn">Editar</Link>
                    <form action={deleteRecommendation}>
                      <input type="hidden" name="id" value={book.id} />
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
