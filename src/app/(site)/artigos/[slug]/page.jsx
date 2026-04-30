import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '../../../../lib/db'

export default async function ArticlePage({ params }) {
  const { slug } = await params
  const article = await prisma.article.findFirst({
    where: { slug, status: 'published' },
  })

  if (!article) notFound()

  return (
    <div className="article-single fade-in-up">
      <Link href="/artigos" className="back-link">Voltar aos artigos</Link>

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
