import { useEffect, useState } from 'react'
import BookCard from '../components/BookCard'
import { bookService } from '../services/dataService'

export default function RecommendationsPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    bookService.getAll()
      .then(setBooks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="content-narrow fade-in-up">
      <div className="page-title">
        <h1>Recomendacoes de Leitura</h1>
      </div>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Uma selecao de obras fundamentais para a formacao crista em teologia,
        filosofia e educacao classica.
      </p>
      {loading && <p style={{ color: 'var(--color-text-muted)' }}>Carregando recomendacoes...</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && !error && books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
