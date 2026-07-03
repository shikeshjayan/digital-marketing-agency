import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function PublicLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Toaster position="top-right" richColors closeButton />
      <Navbar />
      <main className="flex-1">
        <div key={location.pathname} className="animate-page-fade">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

