import BookCard from '../../../components/BookCard'
import { prisma } from '../../../lib/db'

export default async function RecommendationsPage() {
  const books = await prisma.recommendation.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="content-narrow fade-in-up">
      <div className="page-title">
        <h1>Recomendacoes de Leitura</h1>
      </div>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Uma selecao de obras fundamentais para a formacao crista.
      </p>
      {books.map((book) => <BookCard key={book.id} book={book} />)}
    </div>
  )
}
