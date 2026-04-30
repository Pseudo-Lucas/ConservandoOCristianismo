import Link from 'next/link'
import { saveDownload } from '../../actions'

export default function DownloadForm({ item }) {
  return (
    <div className="fade-in-up">
      <div className="admin-page-header">
        <Link href="/admin/downloads" className="back-link">Voltar</Link>
        <h1>{item ? 'Editar Download' : 'Novo Download'}</h1>
      </div>

      <form action={saveDownload} style={{ maxWidth: 680, margin: '0 auto' }}>
        <input type="hidden" name="id" value={item?.id || ''} />
        <div className="admin-field">
          <label htmlFor="download-name">Nome</label>
          <input id="download-name" name="name" defaultValue={item?.name || ''} required />
        </div>
        <div className="admin-field">
          <label htmlFor="download-description">Descricao</label>
          <textarea id="download-description" name="description" rows={4} defaultValue={item?.description || ''} required />
        </div>
        <div className="admin-field">
          <label htmlFor="download-url">URL do arquivo</label>
          <input id="download-url" name="fileUrl" defaultValue={item?.fileUrl || ''} />
        </div>
        <div className="admin-field">
          <label htmlFor="download-category">Categoria</label>
          <input id="download-category" name="category" defaultValue={item?.category || 'Geral'} />
        </div>
        <div className="admin-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input id="download-published" name="published" type="checkbox" defaultChecked={item?.published ?? true} style={{ width: 'auto' }} />
          <label htmlFor="download-published" style={{ margin: 0 }}>Publicado</label>
        </div>
        <button className="btn-classic-filled">Salvar</button>
      </form>
    </div>
  )
}
