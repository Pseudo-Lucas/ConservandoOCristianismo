import 'bootstrap/dist/css/bootstrap.min.css'
import '../index.css'

export const metadata = {
  title: 'Conservando o Cristianismo',
  description: 'Blog de teologia, filosofia crista e educacao classica.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
