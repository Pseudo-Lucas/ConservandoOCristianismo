import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { articleService } from '../services/dataService'

export default function ArticleListAdmin() {
  const [articles, setArticles] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = async () => {
    try {
      setArticles(await articleService.getAll())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refresh()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este artigo?')) return

    try {
      await articleService.delete(id)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    try {
      await articleService.update(id, { status: newStatus })
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  const filtered = filterStatus === 'all'
    ? articles
    : articles.filter((a) => a.status === filterStatus)

  return (
    <div className="fade-in-up">
      <div className="admin-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Artigos</h1>
            <p>Gerencie todos os artigos do blog.</p>
          </div>
          <Link to="/admin/artigos/novo" className="btn-classic-filled">
            Novo Artigo
          </Link>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="category-filter" style={{ marginBottom: '1.5rem' }}>
        <button
          className={filterStatus === 'all' ? 'active' : ''}
          onClick={() => setFilterStatus('all')}
        >
          Todos ({articles.length})
        </button>
        <button
          className={filterStatus === 'published' ? 'active' : ''}
          onClick={() => setFilterStatus('published')}
        >
          Publicados ({articles.filter((a) => a.status === 'published').length})
        </button>
        <button
          className={filterStatus === 'draft' ? 'active' : ''}
          onClick={() => setFilterStatus('draft')}
        >
          Rascunhos ({articles.filter((a) => a.status === 'draft').length})
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Carregando artigos...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          Nenhum artigo encontrado.
        </p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Categoria</th>
                <th>Data</th>
                <th>Status</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((article) => (
                <tr key={article.id}>
                  <td>
                    <strong>{article.title}</strong>
                  </td>
                  <td>{article.category}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{article.date}</td>
                  <td>
                    <span className={`admin-badge ${article.status}`}>
                      {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/admin/artigos/editar/${article.id}`}
                        className="admin-action-btn"
                        title="Editar"
                      >
                        Editar
                      </Link>
                      <button
                        className="admin-action-btn"
                        onClick={() => handleToggleStatus(article.id, article.status)}
                        title={article.status === 'published' ? 'Converter para rascunho' : 'Publicar'}
                      >
                        {article.status === 'published' ? 'Despublicar' : 'Publicar'}
                      </button>
                      <button
                        className="admin-action-btn danger"
                        onClick={() => handleDelete(article.id)}
                        title="Excluir"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
