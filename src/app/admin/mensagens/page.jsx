import { prisma } from '../../../lib/db'

export default async function MessagesAdmin() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="fade-in-up">
      <div className="admin-page-header">
        <h1>Mensagens</h1>
        <p>Mensagens recebidas pelo formulario de contato.</p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Nome</th><th>E-mail</th><th>Assunto</th><th>Mensagem</th></tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td><strong>{message.name}</strong></td>
                <td>{message.email}</td>
                <td>{message.subject}</td>
                <td>{message.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
