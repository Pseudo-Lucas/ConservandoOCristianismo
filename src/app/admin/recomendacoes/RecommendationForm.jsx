import Link from 'next/link'
import { saveRecommendation } from '../../actions'

export default function RecommendationForm({ book }) {
  return (
    <div className="fade-in-up">
      <div className="admin-page-header">
        <Link href="/admin/recomendacoes" className="back-link">Voltar</Link>
        <h1>{book ? 'Editar Recomendacao' : 'Nova Recomendacao'}</h1>
      </div>

      <form action={saveRecommendation} style={{ maxWidth: 680, margin: '0 auto' }}>
        <input type="hidden" name="id" value={book?.id || ''} />
        <div className="admin-field">
          <label htmlFor="book-title">Titulo</label>
          <input id="book-title" name="title" defaultValue={book?.title || ''} required />
        </div>
        <div className="admin-field">
          <label htmlFor="book-author">Autor</label>
          <input id="book-author" name="author" defaultValue={book?.author || ''} required />
        </div>
        <div className="admin-field">
          <label htmlFor="book-description">Descricao</label>
          <textarea id="book-description" name="description" rows={5} defaultValue={book?.description || ''} />
        </div>
        <div className="admin-field">
          <label htmlFor="book-image">Imagem (URL)</label>
          <input id="book-image" name="imageUrl" defaultValue={book?.imageUrl || ''} />
        </div>
        <div className="admin-field">
          <label htmlFor="book-link">Link externo</label>
          <input id="book-link" name="externalLink" defaultValue={book?.externalLink || ''} />
        </div>
        <button className="btn-classic-filled">Salvar</button>
      </form>
    </div>
  )
}
