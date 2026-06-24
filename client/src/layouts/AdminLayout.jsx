import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar.jsx'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1">
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            </div>
          </div>
          <main className="max-w-7xl mx-auto px-4 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

