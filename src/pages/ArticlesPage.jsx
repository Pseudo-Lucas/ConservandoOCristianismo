import { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import { articleService } from '../services/dataService'

const categories = ['Todos', 'Teologia', 'Filosofia', 'Educacao Classica']

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    articleService.getPublished()
      .then(setArticles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory === 'Todos'
    ? articles
    : articles.filter((a) => a.category === activeCategory)

  return (
    <div className="content-narrow fade-in-up">
      <div className="page-title">
        <h1>Artigos</h1>
      </div>

      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={activeCategory === cat ? 'active' : ''}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: 'var(--color-text-muted)' }}>Carregando artigos...</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && !error && filtered.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          Nenhum artigo encontrado nesta categoria.
        </p>
      ) : (
        filtered.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))
      )}
    </div>
  )
}
