import { notFound } from 'next/navigation'
import ArticleForm from '../ArticleForm'
import { prisma } from '../../../../lib/db'

export default async function EditArticlePage({ params }) {
  const { id } = await params
  const article = await prisma.article.findUnique({ where: { id } })
  if (!article) notFound()
  return <ArticleForm article={article} />
}
