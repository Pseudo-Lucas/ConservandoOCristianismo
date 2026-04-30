import Link from 'next/link'
import { prisma } from '../../lib/db'

export default async function AdminDashboard() {
  const [articles, drafts, books, downloads, messages] = await Promise.all([
    prisma.article.count({ where: { status: 'published' } }),
    prisma.article.count({ where: { status: 'draft' } }),
    prisma.recommendation.count(),
    prisma.download.count(),
    prisma.contactMessage.count(),
  ])

  const cards = [
    { label: 'Artigos publicados', value: articles, link: '/admin/artigos', color: 'var(--color-primary)' },
    { label: 'Rascunhos', value: drafts, link: '/admin/artigos', color: 'var(--color-text-muted)' },
    { label: 'Recomendacoes', value: books, link: '/admin/recomendacoes', color: 'var(--color-primary)' },
    { label: 'Downloads', value: downloads, link: '/admin/downloads', color: 'var(--color-primary)' },
    { label: 'Mensagens', value: messages, link: '/admin/mensagens', color: 'var(--color-primary)' },
  ]

  return (
    <div className="fade-in-up">
      <div className="admin-page-header">
        <h1>Painel Editorial</h1>
        <p>Visao geral do conteudo do blog.</p>
      </div>

      <div className="admin-stats-grid">
        {cards.map((card) => (
          <Link to={card.link} href={card.link} key={card.label} className="admin-stat-card">
            <span className="admin-stat-value" style={{ color: card.color }}>{card.value}</span>
            <span className="admin-stat-label">{card.label}</span>
          </Link>
        ))}
      </div>

      <div className="admin-quick-actions">
        <h2>Acoes Rapidas</h2>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <Link href="/admin/artigos/novo" className="btn-classic-filled">Novo Artigo</Link>
          <Link href="/admin/recomendacoes/novo" className="btn-classic">Nova Recomendacao</Link>
          <Link href="/admin/downloads/novo" className="btn-classic">Novo Download</Link>
        </div>
      </div>
    </div>
  )
}
