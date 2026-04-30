import { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import { articleService } from '../services/dataService'

export default function HomePage() {
  const [recentArticles, setRecentArticles] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    articleService.getPublished()
      .then((articles) => setRecentArticles(articles.slice(0, 3)))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="content-narrow fade-in-up">
      <div className="home-intro">
        <h1>Conservando o Cristianismo</h1>
        <p>
          Um espaco dedicado a reflexao teologica, ao estudo das Escrituras,
          a filosofia crista e a educacao classica. Aqui buscamos conservar
          e transmitir a fe uma vez por todas entregue aos santos.
        </p>
      </div>

      <hr className="section-sep" />

      <div className="home-quote">
        <p>
          Toda a Escritura e divinamente inspirada e proveitosa para ensinar,
          para redarguir, para corrigir, para instruir em justica, para que o
          homem de Deus seja perfeito e perfeitamente instruido para toda boa obra.
        </p>
        <cite>2 Timoteo 3:16-17</cite>
      </div>

      <hr className="section-sep" />

      <section>
        <h2>Artigos Recentes</h2>
        {error && <p className="form-error">{error}</p>}
        {!error && recentArticles.length === 0 && (
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
