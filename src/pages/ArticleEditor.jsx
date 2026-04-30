import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import AdminRichTextEditor from '../components/AdminRichTextEditor'
import { articleService } from '../services/dataService'

const CATEGORIES = ['Teologia', 'Filosofia', 'Educacao Classica']

export default function ArticleEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [form, setForm] = useState({
    title: '',
    author: 'Lucas Gomes',
    category: 'Teologia',
    date: '',
    imageUrl: '',
    content: '',
    status: 'draft',
  })
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!isEditing) return

    articleService.getById(id)
      .then((article) => {
        if (!article) return
        setForm({
          title: article.title || '',
          author: article.author || 'Lucas Gomes',
          category: article.category || 'Teologia',
          date: article.date || '',
          imageUrl: article.imageUrl || '',
          content: article.content || '',
          status: article.status || 'draft',
        })
      })
      .catch((err) => setLoadError(err.message))
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    setSaved(false)
  }

  const handleContentChange = (html) => {
    setForm((prev) => ({ ...prev, content: html }))
    setSaved(false)
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'O titulo e obrigatorio.'
    if (!form.author.trim()) errs.author = 'O autor e obrigatorio.'
    if (!form.content.replace(/<[^>]*>/g, '').trim()) errs.content = 'O conteudo e obrigatorio.'
    return errs
  }

  const handleSave = async (status) => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const data = {
      ...form,
      status,
      excerpt: `${form.content.replace(/<[^>]*>/g, '').substring(0, 200)}...`,
    }

    setSaving(true)
    setLoadError('')
    try {
      if (isEditing) {
        await articleService.update(id, data)
      } else {
        await articleService.create(data)
      }

      setSaved(true)
      setTimeout(() => navigate('/admin/artigos'), 800)
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fade-in-up">
      <div className="admin-page-header">
        <Link to="/admin/artigos" className="back-link">Voltar aos artigos</Link>
        <h1>{isEditing ? 'Editar Artigo' : 'Novo Artigo'}</h1>
      </div>

      {loadError && <p className="form-error">{loadError}</p>}

      <div className="admin-editor-layout">
        <div className="admin-editor-main">
          <div className="admin-field">
            <label htmlFor="article-title">Titulo</label>
            <input
              type="text"
              id="article-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Titulo do artigo"
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          <div className="admin-field">
            <label>Conteudo</label>
            <AdminRichTextEditor
              initialContent={form.content}
              onChange={handleContentChange}
            />
            {errors.content && <p className="form-error">{errors.content}</p>}
          </div>
        </div>

        <div className="admin-editor-sidebar">
          <div className="admin-sidebar-card">
            <h3>Publicacao</h3>
            <div className="admin-field">
              <label>Status atual</label>
              <span className={`admin-badge ${form.status}`}>
                {form.status === 'published' ? 'Publicado' : 'Rascunho'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.8rem' }}>
              <button
                type="button"
                className="btn-classic"
                onClick={() => handleSave('draft')}
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar como Rascunho'}
              </button>
              <button
                type="button"
                className="btn-classic-filled"
                onClick={() => handleSave('published')}
                disabled={saving}
              >
                {isEditing ? 'Atualizar e Publicar' : 'Publicar'}
              </button>
            </div>
            {saved && (
              <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Salvo com sucesso!
              </p>
            )}
          </div>

          <div className="admin-sidebar-card">
            <h3>Detalhes</h3>
            <div className="admin-field">
              <label htmlFor="article-author">Autor</label>
              <input
                type="text"
                id="article-author"
                name="author"
                value={form.author}
                onChange={handleChange}
              />
              {errors.author && <p className="form-error">{errors.author}</p>}
            </div>

            <div className="admin-field">
              <label htmlFor="article-category">Categoria</label>
              <select
                id="article-category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="article-date">Data</label>
              <input
                type="text"
                id="article-date"
                name="date"
                value={form.date}
                onChange={handleChange}
                placeholder="Ex: 15 de abril de 2026"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="article-image">Imagem de destaque (URL)</label>
              <input
                type="url"
                id="article-image"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
