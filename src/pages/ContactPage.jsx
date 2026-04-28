import ContactForm from '../components/ContactForm'

export default function ContactPage() {
  return (
    <div className="content-narrow fade-in-up">
      <div className="page-title">
        <h1>Contato</h1>
      </div>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Se deseja enviar uma mensagem, comentário ou sugestão, utilize o
        formulário abaixo. Responderei assim que possível.
      </p>
      <ContactForm />
    </div>
  )
}
