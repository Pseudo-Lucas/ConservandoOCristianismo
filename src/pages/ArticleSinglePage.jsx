import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { articleService } from '../services/dataService'

export default function ArticleSinglePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    articleService.getBySlug(slug)
      .then(setArticle)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="content-narrow fade-in-up">
        <p style={{ color: 'var(--color-text-muted)' }}>Carregando artigo...</p>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="content-narrow fade-in-up">
        <Link to="/artigos" className="back-link">Voltar aos artigos</Link>
        <h1>Artigo nao encontrado</h1>
        <p>{error || 'O artigo que voce procura nao existe ou foi removido.'}</p>
      </div>
    )
  }

  return (
    <div className="article-single fade-in-up">
      <Link to="/artigos" className="back-link">Voltar aos artigos</Link>

      <div className="article-header">
        <span className="article-category">{article.category}</span>
        <h1>{article.title}</h1>
        <p className="article-meta">{article.date} - {article.author}</p>
      </div>

      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  )
}
