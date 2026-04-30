import { useState, useEffect } from 'react'
import { bookService } from '../services/dataService'

const emptyBook = { title: '', author: '', description: '', imageUrl: '', externalLink: '' }

export default function RecommendationEditor() {
  const [books, setBooks] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptyBook })
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = async () => {
    try {
      setBooks(await bookService.getAll())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refresh()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    setSaved(false)
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'O titulo e obrigatorio.'
    if (!form.author.trim()) errs.author = 'O autor e obrigatorio.'
    return errs
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setError('')
    try {
      if (editing === 'new') {
        await bookService.create(form)
      } else {
        await bookService.update(editing, form)
      }

      setSaved(true)
      setTimeout(async () => {
        setEditing(null)
        setForm({ ...emptyBook })
        setSaved(false)
        await refresh()
      }, 600)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (book) => {
    setEditing(book.id)
    setForm({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      imageUrl: book.imageUrl || '',
      externalLink: book.externalLink || '',
    })
    setErrors({})
    setSaved(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir esta recomendacao?')) return

    try {
      await bookService.delete(id)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setForm({ ...emptyBook })
    setErrors({})
    setSaved(false)
  }

  if (editing !== null) {
    return (
      <div className="fade-in-up">
        <div className="admin-page-header">
          <button className="back-link" onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Voltar
          </button>
          <h1>{editing === 'new' ? 'Nova Recomendacao' : 'Editar Recomendacao'}</h1>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div style={{ maxWidth: 600 }}>
          <div className="admin-field">
            <label htmlFor="book-title">Titulo do livro</label>
            <input type="text" id="book-title" name="title" value={form.title} onChange={handleChange} />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          <div className="admin-field">
            <label htmlFor="book-author">Autor</label>
            <input type="text" id="book-author" name="author" value={form.author} onChange={handleChange} />
            {errors.author && <p className="form-error">{errors.author}</p>}
          </div>

          <div className="admin-field">
            <label htmlFor="book-description">Descricao</label>
            <textarea
              id="book-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.95rem',
                border: '1px solid var(--color-border)',
                background: '#fff',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="book-image">Imagem (URL, opcional)</label>
            <input type="url" id="book-image" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className="admin-field">
            <label htmlFor="book-link">Link externo (opcional)</label>
            <input type="url" id="book-link" name="externalLink" value={form.externalLink} onChange={handleChange} placeholder="https://..." />
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
            <button type="button" className="btn-classic-filled" onClick={handleSave}>
              Salvar
            </button>
            <button type="button" className="btn-classic" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
          {saved && (
            <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Salvo com sucesso!
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in-up">
      <div className="admin-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Recomendacoes</h1>
            <p>Gerencie as recomendacoes de leitura.</p>
          </div>
          <button className="btn-classic-filled" onClick={() => { setEditing('new'); setForm({ ...emptyBook }); }}>
            Nova Recomendacao
          </button>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
      {loading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Carregando recomendacoes...</p>
      ) : books.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          Nenhuma recomendacao cadastrada.
        </p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Autor</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td><strong>{book.title}</strong></td>
                  <td>{book.author}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn" onClick={() => handleEdit(book)}>
                        Editar
                      </button>
                      <button className="admin-action-btn danger" onClick={() => handleDelete(book.id)}>
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
