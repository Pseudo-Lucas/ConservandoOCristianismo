import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { initializeDataStores } from './services/dataService'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Public pages
import HomePage from './pages/HomePage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleSinglePage from './pages/ArticleSinglePage'
import RecommendationsPage from './pages/RecommendationsPage'
import DownloadsPage from './pages/DownloadsPage'
import ContactPage from './pages/ContactPage'

// Auth
import LoginPage from './pages/LoginPage'

// Admin pages
import AdminLayout from './pages/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import ArticleListAdmin from './pages/ArticleListAdmin'
import ArticleEditor from './pages/ArticleEditor'
import RecommendationEditor from './pages/RecommendationEditor'
import DownloadManager from './pages/DownloadManager'

// Initialize data stores on app load
initializeDataStores()

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PublicLayout() {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/artigos" element={<ArticlesPage />} />
            <Route path="/artigos/:slug" element={<ArticleSinglePage />} />
            <Route path="/recomendacoes" element={<RecommendationsPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/contato" element={<ContactPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="artigos" element={<ArticleListAdmin />} />
            <Route path="artigos/novo" element={<ArticleEditor />} />
            <Route path="artigos/editar/:id" element={<ArticleEditor />} />
            <Route path="recomendacoes" element={<RecommendationEditor />} />
            <Route path="downloads" element={<DownloadManager />} />
          </Route>

          {/* Public pages */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
