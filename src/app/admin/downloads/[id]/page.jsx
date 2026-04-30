import { notFound } from 'next/navigation'
import DownloadForm from '../DownloadForm'
import { prisma } from '../../../../lib/db'

export default async function EditDownloadPage({ params }) {
  const { id } = await params
  const item = await prisma.download.findUnique({ where: { id } })
  if (!item) notFound()
  return <DownloadForm item={item} />
}
