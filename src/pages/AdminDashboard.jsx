import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { articleService, bookService, downloadService } from '../services/dataService'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ articles: 0, drafts: 0, books: 0, downloads: 0 })
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadStats() {
      try {
        const [articles, books, downloads] = await Promise.all([
          articleService.getAll(),
          bookService.getAll(),
          downloadService.getAll(),
        ])

        setStats({
          articles: articles.filter((a) => a.status === 'published').length,
          drafts: articles.filter((a) => a.status === 'draft').length,
          books: books.length,
          downloads: downloads.length,
        })
      } catch (err) {
        setError(err.message)
      }
    }

    loadStats()
  }, [])

  const cards = [
    { label: 'Artigos publicados', value: stats.articles, link: '/admin/artigos', color: 'var(--color-primary)' },
    { label: 'Rascunhos', value: stats.drafts, link: '/admin/artigos', color: 'var(--color-text-muted)' },
    { label: 'Recomendacoes', value: stats.books, link: '/admin/recomendacoes', color: 'var(--color-primary)' },
    { label: 'Downloads', value: stats.downloads, link: '/admin/downloads', color: 'var(--color-primary)' },
  ]

  return (
    <div className="fade-in-up">
      <div className="admin-page-header">
        <h1>Painel Editorial</h1>
        <p>Visao geral do conteudo do blog.</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="admin-stats-grid">
        {cards.map((card) => (
          <Link to={card.link} key={card.label} className="admin-stat-card">
            <span className="admin-stat-value" style={{ color: card.color }}>
              {card.value}
            </span>
            <span className="admin-stat-label">{card.label}</span>
          </Link>
        ))}
      </div>

      <div className="admin-quick-actions">
        <h2>Acoes Rapidas</h2>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <Link to="/admin/artigos/novo" className="btn-classic-filled">
            Novo Artigo
          </Link>
          <Link to="/admin/recomendacoes" className="btn-classic">
            Gerenciar Recomendacoes
          </Link>
          <Link to="/admin/downloads" className="btn-classic">
            Gerenciar Downloads
          </Link>
        </div>
      </div>
    </div>
  )
}
