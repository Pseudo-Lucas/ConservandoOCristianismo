import { Link } from 'react-router-dom'

export default function ArticleCard({ article }) {
  return (
    <article className="article-card">
      <span className="card-category">{article.category}</span>
      <h3>
        <Link to={`/artigos/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="card-meta">{article.date} — {article.author}</p>
      <p className="card-excerpt">{article.excerpt}</p>
    </article>
  )
}
