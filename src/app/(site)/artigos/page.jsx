import ArticleCard from '../../../components/ArticleCard'
import { prisma } from '../../../lib/db'

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="content-narrow fade-in-up">
      <div className="page-title">
        <h1>Artigos</h1>
      </div>

      {articles.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          Nenhum artigo publicado ainda.
        </p>
      ) : (
        articles.map((article) => <ArticleCard key={article.id} article={article} />)
      )}
    </div>
  )
}
