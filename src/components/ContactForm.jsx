import { useState, useRef } from 'react'
import RichTextEditor from './RichTextEditor'

export default function ContactForm() {
  const editorRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'O campo nome é obrigatório.'
    if (!formData.email.trim()) {
      newErrors.email = 'O campo e-mail é obrigatório.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Insira um e-mail válido.'
    }
    if (!formData.subject.trim()) newErrors.subject = 'O campo assunto é obrigatório.'
    const messageContent = editorRef.current?.innerHTML?.replace(/<[^>]*>/g, '').trim()
    if (!messageContent) newErrors.message = 'O campo mensagem é obrigatório.'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Prepare data for future integration (EmailJS, API, etc.)
    const payload = {
      ...formData,
      message: editorRef.current?.innerHTML || '',
    }
    console.log('Form payload:', payload)

    // Simulate success
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '' })
    if (editorRef.current) editorRef.current.innerHTML = ''
    setErrors({})
  }

  if (submitted) {
    return (
      <div className="form-success fade-in-up">
        <p style={{ marginBottom: 0 }}>
          <strong>Mensagem enviada com sucesso.</strong>
          <br />
          Obrigado pelo contato. Responderei assim que possível.
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

      <button type="submit" className="btn-classic-filled">
        Enviar Mensagem
      </button>
    </form>
  )
}
