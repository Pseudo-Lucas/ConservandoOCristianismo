import Link from 'next/link'
import { saveArticle } from '../../actions'

export default function ArticleForm({ article }) {
  return (
    <div className="fade-in-up">
      <div className="admin-page-header">
        <Link href="/admin/artigos" className="back-link">Voltar aos artigos</Link>
        <h1>{article ? 'Editar Artigo' : 'Novo Artigo'}</h1>
      </div>

      <form action={saveArticle} className="admin-editor-layout">
        <input type="hidden" name="id" value={article?.id || ''} />
        <div className="admin-editor-main">
          <div className="admin-field">
            <label htmlFor="article-title">Titulo</label>
            <input id="article-title" name="title" defaultValue={article?.title || ''} required />
          </div>
          <div className="admin-field">
            <label htmlFor="article-excerpt">Resumo</label>
            <input id="article-excerpt" name="excerpt" defaultValue={article?.excerpt || ''} />
          </div>
          <div className="admin-field">
            <label htmlFor="article-content">Conteudo</label>
            <textarea
              id="article-content"
              name="content"
              defaultValue={article?.content || ''}
              rows={18}
              className="admin-rte-editor"
              required
            />
          </div>
        </div>

        <div className="admin-editor-sidebar">
          <div className="admin-sidebar-card">
            <h3>Publicacao</h3>
            <div className="admin-field">
              <label htmlFor="article-status">Status</label>
              <select id="article-status" name="status" defaultValue={article?.status || 'draft'}>
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>
            <button type="submit" className="btn-classic-filled" style={{ width: '100%' }}>Salvar</button>
          </div>

          <div className="admin-sidebar-card">
            <h3>Detalhes</h3>
            <div className="admin-field">
              <label htmlFor="article-author">Autor</label>
              <input id="article-author" name="author" defaultValue={article?.author || 'Lucas Gomes'} />
            </div>
            <div className="admin-field">
              <label htmlFor="article-category">Categoria</label>
              <input id="article-category" name="category" defaultValue={article?.category || 'Teologia'} />
            </div>
            <div className="admin-field">
              <label htmlFor="article-date">Data</label>
              <input id="article-date" name="date" defaultValue={article?.date || ''} />
            </div>
            <div className="admin-field">
              <label htmlFor="article-image">Imagem (URL)</label>
              <input id="article-image" name="imageUrl" defaultValue={article?.imageUrl || ''} />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
