import { useState, useEffect } from 'react'
import { downloadService } from '../services/dataService'

const CATEGORIES = ['Geral', 'Teologia', 'Filosofia', 'Educacao Classica', 'Patristica']
const emptyItem = { name: '', description: '', fileUrl: '', category: 'Geral', published: true }

export default function DownloadManager() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptyItem })
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = async () => {
    try {
      setItems(await downloadService.getAll())
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
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    setSaved(false)
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'O nome e obrigatorio.'
    if (!form.description.trim()) errs.description = 'A descricao e obrigatoria.'
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
        await downloadService.create(form)
      } else {
        await downloadService.update(editing, form)
      }

      setSaved(true)
      setTimeout(async () => {
        setEditing(null)
        setForm({ ...emptyItem })
        setSaved(false)
        await refresh()
      }, 600)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (item) => {
    setEditing(item.id)
    setForm({
      name: item.name || '',
      description: item.description || '',
      fileUrl: item.fileUrl || '',
      category: item.category || 'Geral',
      published: item.published !== false,
    })
    setErrors({})
    setSaved(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este download?')) return

    try {
      await downloadService.delete(id)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setForm({ ...emptyItem })
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
          <h1>{editing === 'new' ? 'Novo Download' : 'Editar Download'}</h1>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div style={{ maxWidth: 600 }}>
          <div className="admin-field">
            <label htmlFor="dl-name">Nome do arquivo</label>
            <input type="text" id="dl-name" name="name" value={form.name} onChange={handleChange} />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="admin-field">
            <label htmlFor="dl-description">Descricao</label>
            <textarea
              id="dl-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
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
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          <div className="admin-field">
            <label htmlFor="dl-url">URL do arquivo</label>
            <input type="url" id="dl-url" name="fileUrl" value={form.fileUrl} onChange={handleChange} placeholder="https://... ou caminho do arquivo" />
          </div>

          <div className="admin-field">
            <label htmlFor="dl-category">Categoria</label>
            <select id="dl-category" name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="admin-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="dl-published"
              name="published"
              checked={form.published}
              onChange={handleChange}
              style={{ width: 'auto' }}
            />
            <label htmlFor="dl-published" style={{ margin: 0, textTransform: 'none', letterSpacing: 'normal', fontSize: '0.95rem' }}>
              Publicado (visivel para visitantes)
            </label>
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
            <h1>Downloads</h1>
            <p>Gerencie os materiais disponiveis para download.</p>
          </div>
          <button className="btn-classic-filled" onClick={() => { setEditing('new'); setForm({ ...emptyItem }); }}>
            Novo Download
          </button>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
      {loading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Carregando downloads...</p>
      ) : items.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          Nenhum download cadastrado.
        </p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.category}</td>
                  <td>
                    <span className={`admin-badge ${item.published ? 'published' : 'draft'}`}>
                      {item.published ? 'Publicado' : 'Oculto'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn" onClick={() => handleEdit(item)}>
                        Editar
                      </button>
                      <button className="admin-action-btn danger" onClick={() => handleDelete(item.id)}>
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
