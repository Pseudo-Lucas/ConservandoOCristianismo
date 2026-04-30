import { notFound } from 'next/navigation'
import RecommendationForm from '../RecommendationForm'
import { prisma } from '../../../../lib/db'

export default async function EditRecommendationPage({ params }) {
  const { id } = await params
  const book = await prisma.recommendation.findUnique({ where: { id } })
  if (!book) notFound()
  return <RecommendationForm book={book} />
}
