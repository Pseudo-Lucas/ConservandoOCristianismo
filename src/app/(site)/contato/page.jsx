import { createContactMessage } from '../../actions'

export default function ContactPage() {
  return (
    <div className="content-narrow fade-in-up">
      <div className="page-title">
        <h1>Contato</h1>
      </div>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Envie uma mensagem, comentario ou sugestao pelo formulario abaixo.
      </p>
      <form className="contact-form" action={createContactMessage}>
        <div className="form-group">
          <label htmlFor="contact-name">Nome</label>
          <input id="contact-name" name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="contact-email">E-mail</label>
          <input id="contact-email" name="email" type="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="contact-subject">Assunto</label>
          <input id="contact-subject" name="subject" required />
        </div>
        <div className="form-group">
          <label htmlFor="contact-message">Mensagem</label>
          <textarea id="contact-message" name="message" rows={7} required />
        </div>
        <button type="submit" className="btn-classic-filled">Enviar Mensagem</button>
      </form>
    </div>
  )
}
