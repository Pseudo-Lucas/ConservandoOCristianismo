import { useEffect, useState } from 'react'
import DownloadCard from '../components/DownloadCard'
import { downloadService } from '../services/dataService'

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    downloadService.getPublished()
      .then(setDownloads)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="content-narrow fade-in-up">
      <div className="page-title">
        <h1>Downloads</h1>
      </div>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Materiais de estudo disponiveis para download gratuito.
      </p>
      {loading && <p style={{ color: 'var(--color-text-muted)' }}>Carregando downloads...</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && !error && downloads.map((item) => (
        <DownloadCard key={item.id} item={item} />
      ))}
    </div>
  )
}
