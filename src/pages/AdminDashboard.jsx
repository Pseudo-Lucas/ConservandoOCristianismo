import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { articleService, bookService, downloadService } from '../services/dataService'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ articles: 0, drafts: 0, books: 0, downloads: 0 })

  useEffect(() => {
    const articles = articleService.getAll()
    setStats({
      articles: articles.filter((a) => a.status === 'published').length,
      drafts: articles.filter((a) => a.status === 'draft').length,
      books: bookService.getAll().length,
      downloads: downloadService.getAll().length,
    })
  }, [])

  const cards = [
    { label: 'Artigos publicados', value: stats.articles, link: '/admin/artigos', color: 'var(--color-primary)' },
    { label: 'Rascunhos', value: stats.drafts, link: '/admin/artigos', color: 'var(--color-text-muted)' },
    { label: 'Recomendações', value: stats.books, link: '/admin/recomendacoes', color: 'var(--color-primary)' },
    { label: 'Downloads', value: stats.downloads, link: '/admin/downloads', color: 'var(--color-primary)' },
  ]

  return (
    <div className="fade-in-up">
      <div className="admin-page-header">
        <h1>Painel Editorial</h1>
        <p>Visão geral do conteúdo do blog.</p>
      </div>

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
        <h2>Ações Rápidas</h2>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <Link to="/admin/artigos/novo" className="btn-classic-filled">
            Novo Artigo
          </Link>
          <Link to="/admin/recomendacoes" className="btn-classic">
            Gerenciar Recomendações
          </Link>
          <Link to="/admin/downloads" className="btn-classic">
            Gerenciar Downloads
          </Link>
        </div>
      </div>
    </div>
  )
}
