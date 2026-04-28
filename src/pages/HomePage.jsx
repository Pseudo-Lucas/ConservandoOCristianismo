import ArticleCard from '../components/ArticleCard'
import { articleService } from '../services/dataService'

export default function HomePage() {
  const articles = articleService.getPublished()
  const recentArticles = articles.slice(0, 3)

  return (
    <div className="content-narrow fade-in-up">
      <div className="home-intro">
        <h1>Conservando o Cristianismo</h1>
        <p>
          Um espaço dedicado à reflexão teológica, ao estudo das Escrituras,
          à filosofia cristã e à educação clássica. Aqui buscamos conservar
          e transmitir a fé «uma vez por todas entregue aos santos».
        </p>
      </div>

      <hr className="section-sep" />

      <div className="home-quote">
        <p>
          «Toda a Escritura é divinamente inspirada e proveitosa para ensinar,
          para redarguir, para corrigir, para instruir em justiça, para que o
          homem de Deus seja perfeito e perfeitamente instruído para toda boa obra.»
        </p>
        <cite>— 2 Timóteo 3:16–17</cite>
      </div>

      <hr className="section-sep" />

      <section>
        <h2>Artigos Recentes</h2>
        {recentArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </section>
    </div>
  )
}
