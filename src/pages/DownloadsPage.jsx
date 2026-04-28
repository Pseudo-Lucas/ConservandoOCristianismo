import DownloadCard from '../components/DownloadCard'
import { downloadService } from '../services/dataService'

export default function DownloadsPage() {
  const downloads = downloadService.getPublished()

  return (
    <div className="content-narrow fade-in-up">
      <div className="page-title">
        <h1>Downloads</h1>
      </div>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Materiais de estudo disponíveis para download gratuito.
      </p>
      {downloads.map((item) => (
        <DownloadCard key={item.id} item={item} />
      ))}
    </div>
  )
}
