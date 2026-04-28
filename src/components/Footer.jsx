export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-name">conservando o cristianismo</p>
        <p className="footer-copy">&copy; {year} Todos os direitos reservados.</p>
        <p className="footer-verse">
          «Retém o modelo das sãs palavras que de mim tens ouvido, na fé e no amor que há em Cristo Jesus.»
          <br />— 2 Timóteo 1:13
        </p>
      </div>
    </footer>
  )
}
