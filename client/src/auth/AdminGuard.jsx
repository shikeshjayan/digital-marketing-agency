import { Navigate, Outlet } from 'react-router-dom'
import { getAdminToken } from './adminAuth.js'

export default function AdminGuard() {
  const token = getAdminToken()
  if (!token) return <Navigate to="/admin/login" replace />
  return <Outlet />
}

