import { useState, useRef } from 'react'
import RichTextEditor from './RichTextEditor'
import { contactService } from '../services/dataService'

export default function ContactForm() {
  const editorRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    setSubmitError('')
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'O campo nome e obrigatorio.'
    if (!formData.email.trim()) {
      newErrors.email = 'O campo e-mail e obrigatorio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Insira um e-mail valido.'
    }
    if (!formData.subject.trim()) newErrors.subject = 'O campo assunto e obrigatorio.'
    const messageContent = editorRef.current?.innerHTML?.replace(/<[^>]*>/g, '').trim()
    if (!messageContent) newErrors.message = 'O campo mensagem e obrigatorio.'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const payload = {
      ...formData,
      message: editorRef.current?.innerHTML || '',
    }

    setSubmitting(true)
    setSubmitError('')
    try {
      await contactService.create(payload)
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '' })
      if (editorRef.current) editorRef.current.innerHTML = ''
      setErrors({})
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="form-success fade-in-up">
        <p style={{ marginBottom: 0 }}>
          <strong>Mensagem enviada com sucesso.</strong>
          <br />
          Obrigado pelo contato. Responderei assim que possivel.
        </p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="contact-name">Nome</label>
        <input
          type="text"
          id="contact-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="contact-email">E-mail</label>
        <input
          type="email"
          id="contact-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="contact-subject">Assunto</label>
        <input
          type="text"
          id="contact-subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
        />
        {errors.subject && <p className="form-error">{errors.subject}</p>}
      </div>

      <div className="form-group">
        <label>Mensagem</label>
        <RichTextEditor editorRef={editorRef} />
        {errors.message && <p className="form-error">{errors.message}</p>}
      </div>

      {submitError && <p className="form-error">{submitError}</p>}

      <button type="submit" className="btn-classic-filled" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Enviar Mensagem'}
      </button>
    </form>
  )
}
