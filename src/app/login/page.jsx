import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-box fade-in-up">
        <div className="login-header">
          <span className="login-cross" aria-hidden="true">+</span>
          <h1>Editor</h1>
          <p>Acesso restrito a area editorial</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
