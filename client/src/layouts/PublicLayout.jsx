// Shared shell for all public pages: navbar at top, page content in the middle, footer at bottom
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />
      <main className="flex-1">
        {/* Each route renders its page here */}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
