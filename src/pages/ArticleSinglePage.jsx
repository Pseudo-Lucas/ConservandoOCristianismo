import { useParams, Link } from 'react-router-dom'
import { articleService } from '../services/dataService'

export default function ArticleSinglePage() {
  const { slug } = useParams()
  const article = articleService.getBySlug(slug)

  if (!article) {
    return (
      <div className="content-narrow fade-in-up">
        <Link to="/artigos" className="back-link">← Voltar aos artigos</Link>
        <h1>Artigo não encontrado</h1>
        <p>O artigo que você procura não existe ou foi removido.</p>
      </div>
    )
  }

  return (
    <div className="article-single fade-in-up">
      <Link to="/artigos" className="back-link">← Voltar aos artigos</Link>

      <div className="article-header">
        <span className="article-category">{article.category}</span>
        <h1>{article.title}</h1>
        <p className="article-meta">{article.date} — {article.author}</p>
      </div>

      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  )
}
