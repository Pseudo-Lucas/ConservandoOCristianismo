export default function BookCard({ book }) {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p className="book-author">{book.author}</p>
      <p className="book-desc">{book.description}</p>
    </div>
  )
}
