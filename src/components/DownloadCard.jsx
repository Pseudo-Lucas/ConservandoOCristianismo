'use client'

export default function DownloadCard({ item }) {
  const handleDownload = () => {
    if (item.fileUrl) {
      window.open(item.fileUrl, '_blank', 'noopener,noreferrer')
      return
    }

    alert(`O download de "${item.name}" sera disponibilizado em breve.`)
  }

  return (
    <div className="download-card">
      <div className="dl-info">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
      <button className="btn-classic" onClick={handleDownload}>
        Baixar
      </button>
    </div>
  )
}
