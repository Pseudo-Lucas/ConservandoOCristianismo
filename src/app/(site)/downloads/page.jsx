import DownloadCard from '../../../components/DownloadCard'
import { prisma } from '../../../lib/db'

export default async function DownloadsPage() {
  const downloads = await prisma.download.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="content-narrow fade-in-up">
      <div className="page-title">
        <h1>Downloads</h1>
      </div>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Materiais de estudo disponiveis para download gratuito.
      </p>
      {downloads.map((item) => <DownloadCard key={item.id} item={item} />)}
    </div>
  )
}
