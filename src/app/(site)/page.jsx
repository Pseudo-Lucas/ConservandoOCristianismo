import ArticleCard from '../../components/ArticleCard'
import { prisma } from '../../lib/db'

export default async function HomePage() {
  const recentArticles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  return (
    <div className="content-narrow fade-in-up">
      <div className="home-intro">
        <h1>Conservando o Cristianismo</h1>
        <p>
          Um espaco dedicado a reflexao teologica, ao estudo das Escrituras,
          a filosofia crista e a educacao classica.
        </p>
      </div>

      <hr className="section-sep" />

      <div className="home-quote">
        <p>
          Toda a Escritura e divinamente inspirada e proveitosa para ensinar,
          para redarguir, para corrigir, para instruir em justica.
        </p>
        <cite>2 Timoteo 3:16-17</cite>
      </div>

      <hr className="section-sep" />

      <section>
        <h2>Artigos Recentes</h2>
        {recentArticles.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
            Nenhum artigo publicado ainda.
          </p>
        )}
        {recentArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </section>
    </div>
  )
}
