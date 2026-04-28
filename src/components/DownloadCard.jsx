export default function DownloadCard({ item }) {
  const handleDownload = () => {
    alert(`O download de "${item.name}" será disponibilizado em breve.`)
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
