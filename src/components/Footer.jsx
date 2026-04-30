export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-name">conservando o cristianismo</p>
        <p className="footer-copy">&copy; {year} Todos os direitos reservados.</p>
        <p className="footer-verse">
          Retem o modelo das sas palavras que de mim tens ouvido, na fe e no amor que ha em Cristo Jesus.
          <br />2 Timoteo 1:13
        </p>
      </div>
    </footer>
  )
}
