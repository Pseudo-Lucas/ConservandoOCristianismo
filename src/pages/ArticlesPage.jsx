import { useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import { articleService } from '../services/dataService'

const categories = ['Todos', 'Teologia', 'Filosofia', 'Educação Clássica']

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const articles = articleService.getPublished()

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

      {filtered.length === 0 ? (
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
