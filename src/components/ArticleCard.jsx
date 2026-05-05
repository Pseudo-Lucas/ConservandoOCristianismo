import Link from 'next/link'

export default function ArticleCard({ article }) {
  return (
    <article className="article-card">
      {article.imageUrl ? (
        <Link href={`/artigos/${article.slug}`} className="article-card-thumb" aria-label={article.title}>
          <img src={article.imageUrl} alt="" />
        </Link>
      ) : null}
      <div className="article-card-content">
        <span className="card-category">{article.category}</span>
        <h3>
          <Link href={`/artigos/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="card-meta">{article.date} - {article.author}</p>
        <p className="card-excerpt">{article.excerpt}</p>
      </div>
    </article>
  )
}
