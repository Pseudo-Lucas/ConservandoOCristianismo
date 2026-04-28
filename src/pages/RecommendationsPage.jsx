import BookCard from '../components/BookCard'
import { bookService } from '../services/dataService'

export default function RecommendationsPage() {
  const books = bookService.getAll()

  return (
    <div className="content-narrow fade-in-up">
      <div className="page-title">
        <h1>Recomendações de Leitura</h1>
      </div>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Uma seleção de obras que considero fundamentais para a formação cristã
        — em teologia, filosofia e educação clássica.
      </p>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
